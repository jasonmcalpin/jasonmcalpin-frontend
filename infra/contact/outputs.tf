output "contact_api_url" {
  description = "Set as the VITE_CONTACT_API_URL build variable."
  value       = "${aws_apigatewayv2_stage.default.invoke_url}v1/inquiries"
}
output "ses_verification_status" {
  description = "Sending is unavailable until domain verification completes."
  value       = aws_sesv2_email_identity.sender_domain.verification_status
}
output "ses_dkim_cname_records" {
  description = "Add these CNAME records with your DNS provider, without proxying them."
  value = [
    for token in try(aws_sesv2_email_identity.sender_domain.dkim_signing_attributes[0].tokens, []) : {
      type  = "CNAME"
      name  = "${token}._domainkey.${var.ses_domain}"
      value = "${token}.dkim.amazonses.com"
    }
  ]
}
output "turnstile_secret_ssm_parameter" {
  value = var.turnstile_secret_parameter_name
}
