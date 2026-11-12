variable "aws_region" {
  description = "AWS region for SES and Lambda. SES identities are regional."
  type        = string
  default     = "us-east-1"
}
variable "environment" {
  description = "Resource namespace. Use a separate Terraform state for each deployment."
  type        = string
  default     = "production"
  validation {
    condition     = can(regex("^[a-z0-9-]{2,24}$", var.environment))
    error_message = "Use 2-24 lowercase letters, digits or hyphens."
  }
}
variable "ses_domain" {
  description = "Domain to verify for SES sending, for example jasonmcalpin.com."
  type        = string
}
variable "sender_local_part" {
  description = "Sender local-part, for example inquiries."
  type        = string
  default     = "inquiries"
  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9._-]{0,40}$", var.sender_local_part))
    error_message = "Use a safe lowercase local-part."
  }
}
variable "recipient_email" {
  description = "Private destination mailbox. Supply using TF_VAR_recipient_email or untracked terraform.tfvars."
  type        = string
  sensitive   = true
}
variable "turnstile_secret_parameter_name" {
  description = "Existing SSM SecureString parameter name. The secret value never enters Terraform state."
  type        = string
  default     = "/jasonmcalpin/contact/turnstile-secret"
  validation {
    condition     = startswith(var.turnstile_secret_parameter_name, "/")
    error_message = "Use an absolute SSM parameter name."
  }
}
variable "allowed_origins" {
  description = "Exact website origins allowed to post. Add localhost only for controlled testing."
  type        = list(string)
  default = [
    "https://jasonmcalpin.com",
    "https://www.jasonmcalpin.com",
    "https://staged.jasonmcalpin.com"
  ]
  validation {
    condition = length(var.allowed_origins) > 0 && alltrue([
      for origin in var.allowed_origins : can(regex("^https?://[^/]+$", origin))
    ])
    error_message = "Use exact origins with scheme and hostname, no path or trailing slash."
  }
}
