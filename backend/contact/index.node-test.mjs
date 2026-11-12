import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, parseInquiry } from './index.mjs';
const valid = {
  name: 'A Business Client', email: 'client@example.org',
  message: 'We need to migrate an internal system and improve our workflows.',
  timeline: 'Q1', turnstileToken: 'test-token-with-sufficient-length', website: ''
};
const origin = 'https://staged.jasonmcalpin.com';
const evt = (payload = valid, overrides = {}) => ({
  requestContext: { http: { method: 'POST' } },
  headers: { origin, 'content-type': 'application/json' },
  body: JSON.stringify(payload), ...overrides
});
function setup({ verify = async () => ({
  success: true, action: 'contact_inquiry', hostname: 'staged.jasonmcalpin.com'
}), send = async () => {} } = {}) {
  return createHandler({ allowedOrigins: [origin], allowedHostnames: ['staged.jasonmcalpin.com'],
    verifyTurnstile: verify, sendInquiry: send });
}
const body = response => JSON.parse(response.body);
test('accepts verified inquiry and does not pass token to mailer', async () => {
  let delivered;
  const response = await setup({ send: async item => { delivered = item; } })(evt());
  assert.equal(response.statusCode, 202);
  assert.equal(body(response).code, 'accepted');
  assert.equal(delivered.email, valid.email);
  assert.equal(Object.hasOwn(delivered, 'turnstileToken'), false);
});
test('requires an allowed origin, JSON, and bounded body', async () => {
  const h = setup();
  assert.equal((await h(evt(valid, { headers: {
    origin: 'https://evil.invalid', 'content-type': 'application/json' } }))).statusCode, 403);
  assert.equal((await h(evt(valid, { headers: { origin, 'content-type': 'text/plain' } }))).statusCode, 415);
  assert.equal((await h(evt(valid, { body: 'x'.repeat(8193) }))).statusCode, 413);
  assert.equal((await h(evt(valid, { body: '{' }))).statusCode, 400);
});
test('validates field sizes and prevents reply-to injection', () => {
  assert.equal(parseInquiry({ ...valid, email: 'name@example.org\nBcc: attack@example.org' }), null);
  assert.equal(parseInquiry({ ...valid, message: 'short' }), null);
  assert.equal(parseInquiry({ ...valid, turnstileToken: 'a' }), null);
  assert.ok(parseInquiry(valid));
});
test('rejects missing, wrong-action, and wrong-host verification', async () => {
  for (const value of [
    { success: false, action: 'contact_inquiry', hostname: 'staged.jasonmcalpin.com' },
    { success: true, action: 'login', hostname: 'staged.jasonmcalpin.com' },
    { success: true, action: 'contact_inquiry', hostname: 'untrusted.invalid' }
  ]) assert.equal((await setup({ verify: async () => value })(evt())).statusCode, 403);
});
test('anti-spam and email failures return no private details', async () => {
  assert.equal((await setup({ verify: async () => { throw Error('token-secret'); } })(evt())).statusCode, 503);
  assert.equal((await setup({ send: async () => { throw Error('mailbox-secret'); } })(evt())).statusCode, 503);
});
test('honeypot is discarded without verification or email', async () => {
  const h = setup({ verify: async () => { throw Error('unexpected'); },
    send: async () => { throw Error('unexpected'); } });
  assert.equal((await h(evt({ ...valid, website: 'spam' }))).statusCode, 202);
});
test('rejects non-POST and base64 requests', async () => {
  const h = setup();
  assert.equal((await h(evt(valid, { requestContext: { http: { method: 'GET' } } }))).statusCode, 405);
  assert.equal((await h(evt(valid, { isBase64Encoded: true }))).statusCode, 413);
});
