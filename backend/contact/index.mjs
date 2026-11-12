/**
 * Public contact endpoint. The Lambda handler delegates to createHandler,
 * whose injected dependencies allow tests without AWS credentials.
 * Never log request bodies, contact details, Turnstile tokens or secrets.
 */
const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
const reply = (statusCode, code, message) => ({
  statusCode, headers: JSON_HEADERS, body: JSON.stringify({ code, message })
});
function cleanText(value, min, max) {
  if (typeof value !== 'string') return null;
  const text = value.trim().replace(/\r\n?/g, '\n');
  if (text.length < min || text.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) return null;
  return text;
}
export function parseInquiry(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const name = cleanText(value.name, 2, 100);
  const email = cleanText(value.email, 3, 254);
  const message = cleanText(value.message, 20, 3000);
  const timeline = cleanText(value.timeline ?? '', 0, 250);
  const token = cleanText(value.turnstileToken, 20, 2048);
  const website = cleanText(value.website ?? '', 0, 200);
  if (!name || !email || !message || timeline === null || !token || website === null) return null;
  if (email.includes('\n') || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return null;
  return { name, email, message, timeline, token, website };
}
function header(headers, key) {
  const match = Object.entries(headers ?? {}).find(([name]) => name.toLowerCase() === key);
  return typeof match?.[1] === 'string' ? match[1] : '';
}
export function createHandler({ allowedOrigins, allowedHostnames, verifyTurnstile, sendInquiry }) {
  const origins = new Set(allowedOrigins);
  const hosts = new Set(allowedHostnames);
  return async event => {
    if (event?.requestContext?.http?.method !== 'POST') return reply(405, 'method_not_allowed', 'Method not allowed.');
    if (!origins.has(header(event.headers, 'origin'))) return reply(403, 'origin_rejected', 'This request is not permitted.');
    if (!header(event.headers, 'content-type').toLowerCase().startsWith('application/json'))
      return reply(415, 'invalid_content_type', 'Send a JSON request.');
    if (event.isBase64Encoded || typeof event.body !== 'string' ||
        Buffer.byteLength(event.body, 'utf8') > 8192)
      return reply(413, 'invalid_request_size', 'The request is too large.');
    let raw;
    try { raw = JSON.parse(event.body); }
    catch { return reply(400, 'invalid_json', 'Invalid request.'); }
    const inquiry = parseInquiry(raw);
    if (!inquiry) return reply(400, 'invalid_inquiry', 'Please review the required fields.');
    // A hidden honeypot field absorbs unsophisticated bots without email costs.
    if (inquiry.website) return reply(202, 'accepted', 'Your inquiry has been received.');
    let verified;
    try { verified = await verifyTurnstile(inquiry.token); }
    catch (error) {
      console.error('Contact anti-spam verification unavailable:', error?.name || 'unknown');
      return reply(503, 'verification_unavailable', 'Verification is unavailable. Please retry.');
    }
    if (!verified?.success || verified.action !== 'contact_inquiry' || !hosts.has(verified.hostname))
      return reply(403, 'verification_failed', 'Verification expired or failed. Please retry.');
    try {
      await sendInquiry({ name: inquiry.name, email: inquiry.email,
        message: inquiry.message, timeline: inquiry.timeline });
      // SES acceptance is not proof of final inbox delivery.
      return reply(202, 'accepted', 'Your inquiry has been submitted.');
    } catch (error) {
      console.error('Contact notification delivery unavailable:', error?.name || 'unknown');
      return reply(503, 'delivery_unavailable', 'Your inquiry could not be accepted. Please retry later.');
    }
  };
}
let secretCache;
let awsClients;
async function getAwsClients() {
  if (!awsClients) {
    // Node.js 22 AWS Lambda includes SDK v3; see Terraform README tradeoffs.
    const [{ SSMClient, GetParameterCommand }, { SESv2Client, SendEmailCommand }] = await Promise.all([
      import('@aws-sdk/client-ssm'), import('@aws-sdk/client-sesv2')
    ]);
    awsClients = {
      ssm: new SSMClient({}), ses: new SESv2Client({}),
      GetParameterCommand, SendEmailCommand
    };
  }
  return awsClients;
}
async function getTurnstileSecret() {
  if (secretCache) return secretCache;
  const { ssm, GetParameterCommand } = await getAwsClients();
  const result = await ssm.send(new GetParameterCommand({
    Name: process.env.TURNSTILE_SECRET_PARAMETER, WithDecryption: true
  }));
  const secret = result.Parameter?.Value;
  if (!secret) throw new Error('MissingTurnstileSecret');
  secretCache = secret;
  return secret;
}
async function verifyTurnstile(token) {
  const secret = await getTurnstileSecret();
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
    signal: AbortSignal.timeout(7000)
  });
  if (!response.ok) throw new Error('TurnstileUnavailable');
  return response.json();
}
async function sendInquiry(inquiry) {
  const { ses, SendEmailCommand } = await getAwsClients();
  const body = [
    'New website project inquiry', '',
    'Name: ' + inquiry.name, 'Reply-to: ' + inquiry.email,
    'Timeline: ' + (inquiry.timeline || 'Not supplied'), '',
    'Project:', inquiry.message
  ].join('\n');
  return ses.send(new SendEmailCommand({
    FromEmailAddress: process.env.SENDER_EMAIL,
    Destination: { ToAddresses: [process.env.RECIPIENT_EMAIL] },
    ReplyToAddresses: [inquiry.email],
    Content: { Simple: {
      Subject: { Data: 'Website project inquiry', Charset: 'UTF-8' },
      Body: { Text: { Data: body, Charset: 'UTF-8' } }
    } }
  }));
}
export async function handler(event) {
  const origins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
  const hostnames = origins.map(origin => {
    try { return new URL(origin).hostname; } catch { return ''; }
  }).filter(Boolean);
  return createHandler({ allowedOrigins: origins, allowedHostnames: hostnames,
    verifyTurnstile, sendInquiry })(event);
}
