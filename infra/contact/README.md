# Contact service (Terraform)

A separate AWS contact service for the static consulting website. Terraform creates an
SES sending-domain identity, a Node.js 22 Lambda, least-privilege IAM, an HTTP API
Gateway route (POST /v1/inquiries) and short-retention CloudWatch logs. The site stays
static. **Creating or merging a PR does not create AWS resources.**

## Prerequisites

- Terraform >= 1.6 and AWS credentials with permission to create the resources.
- Control of DNS for the sender domain, plus a private inbox that receives inquiries.
- An AWS region (default us-east-1) for both the SES identity and Lambda.
- Cloudflare Turnstile widget with jasonmcalpin.com, www.jasonmcalpin.com and
  staged.jasonmcalpin.com added as allowed hostnames.
- Private, encrypted and access-controlled Terraform state. The Turnstile secret
  does not enter state, but the private recipient mailbox does appear in Lambda
  environment configuration and Terraform state.

## 1. Configure Turnstile

Create a Cloudflare Turnstile widget and obtain its public site key and private
secret key. Create an AWS Systems Manager Parameter Store **SecureString** in
the Lambda region, with this name:

    /jasonmcalpin/contact/turnstile-secret

Store only the secret key as its value. Use the AWS Console or secure secret
management workflow, never Git or a terraform.tfvars file. Terraform references
the parameter ARN but does not read the secret value. A rotated secret may
remain cached until Lambda restarts.

## 2. Deploy the AWS infrastructure

Copy terraform.tfvars.example to untracked terraform.tfvars in this folder.
Change ses_domain to your verified domain. Provide your private destination
mailbox in the untracked file or as TF_VAR_recipient_email in the shell.

    cd infra/contact
    terraform init
    terraform fmt -check
    terraform validate
    terraform plan
    terraform apply

For a long-lived deployment, configure an encrypted, versioned S3 state backend
with access restrictions and locking before initializing. Do not commit local
state files. If the SES domain identity already exists, import it before apply
rather than attempting to create another identity:

    terraform import aws_sesv2_email_identity.sender_domain jasonmcalpin.com

The Terraform workflow validates the configuration, but never runs apply.

## 3. Configure SES DNS

Run:

    terraform output ses_dkim_cname_records

Create the returned CNAME records with your DNS provider (DNS-only, not
Cloudflare-proxied). Confirm SES marks the identity verified. Add appropriate
SPF/DMARC DNS records for your sending domain. The sender is constructed from
sender_local_part and ses_domain, while recipient_email is the private inbox.

New SES accounts may be in the sending sandbox, which restricts recipients.
Request production access or use a verified destination for initial testing.
Do not activate the public form until you receive a real test inquiry.

## 4. Connect the static website

Run:

    terraform output -raw contact_api_url

Set these GitHub Actions *repository variables* (not secrets):

- CONTACT_API_URL: the Terraform API URL including /v1/inquiries
- TURNSTILE_SITE_KEY: the public widget site key

CI passes them into Vite at build time. For local development, use an
untracked .env.local containing VITE_CONTACT_API_URL and VITE_TURNSTILE_SITE_KEY.
Do not put the private recipient or Turnstile secret into VITE variables.

The Terraform CORS allowlist defaults to the three HTTPS website origins. For
localhost testing, explicitly add http://localhost:5173 to allowed_origins,
and use a Turnstile widget/test key that accepts localhost. Remove localhost
from the production allowlist afterward.

The website CSP allows Cloudflare Turnstile and AWS API Gateway connections.
If you change to a custom API hostname, update both index.html and .htaccess CSP.

If either public variable is missing, the UI explicitly says the form is not
connected and displays a LinkedIn alternative instead of a broken Send button.

## 5. Verify behavior

Unit test the handler without AWS credentials:

    node --test backend/contact/index.node-test.mjs

In staging, test the complete browser -> API -> Lambda -> SES -> inbox flow.
Test invalid/expired Turnstile verification and delivery errors as well as the
happy path. Confirm the visitor email becomes the Reply-To address, but cannot
select the recipient; confirm there is no recipient mailbox or Turnstile secret
in HTML, JS, llms.txt or CloudWatch logs. SES returning HTTP 202 means SES
accepted the message for delivery, not that the mailbox received it.

## Contracts and operating characteristics

- A single public POST route; exact origin check is defense-in-depth, not auth.
- Bounded JSON input, required fields, honeypot, server-side one-time Turnstile
  verification (expected action and hostname), and no user-specified recipient.
- API Gateway throttles traffic and Lambda reserved concurrency is two. These
  are not per-IP rate limits. Add AWS WAF or cost alerts if abuse warrants it.
- Secret read is limited to one SSM parameter. SES sending is limited to one
  verified domain identity.
- No database, queue or retention of full inquiry content in CloudWatch.
  Retention of delivered emails is governed by the private mailbox provider.
- The single-file Lambda archive relies on SDK v3 included in the AWS Lambda
  Node.js 22 runtime. AWS recommends bundling/pinning the SDK for long-lived
  packages. Keep the runtime dependency documented and explicitly migrate to
  a pinned bundle if that managed-runtime assumption becomes a maintenance risk.

## Activation checklist

1. Review and merge source only after CI passes.
2. Create the SSM Turnstile secret and choose your private recipient mailbox.
3. Apply Terraform from a protected state backend.
4. Verify SES identity/DKIM and sending privileges.
5. Set GitHub build variables and redeploy staging.
6. Submit an inquiry and verify actual inbox delivery.
7. Publish a new production tag after the end-to-end check passes.
