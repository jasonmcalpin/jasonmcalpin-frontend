data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}

locals {
  name         = "jm-contact-${var.environment}"
  sender_email = "${var.sender_local_part}@${var.ses_domain}"
  ssm_arn      = "arn:${data.aws_partition.current.partition}:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter${var.turnstile_secret_parameter_name}"
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/../../backend/contact/index.mjs"
  output_path = "${path.module}/contact-lambda.zip"
}

resource "aws_sesv2_email_identity" "sender_domain" {
  email_identity = var.ses_domain
}

resource "aws_iam_role" "lambda" {
  name = "${local.name}-lambda"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "basic_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "contact" {
  statement {
    sid       = "OnlySendViaVerifiedIdentity"
    actions   = ["ses:SendEmail"]
    resources = [aws_sesv2_email_identity.sender_domain.arn]
  }
  statement {
    sid       = "OnlyReadTurnstileSecret"
    actions   = ["ssm:GetParameter"]
    resources = [local.ssm_arn]
  }
}

resource "aws_iam_role_policy" "contact" {
  name   = "${local.name}-contact"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.contact.json
}

resource "aws_cloudwatch_log_group" "contact" {
  name              = "/aws/lambda/${local.name}"
  retention_in_days = 7
}

resource "aws_lambda_function" "contact" {
  function_name                  = local.name
  description                    = "Validated Turnstile-protected inquiries via SES"
  filename                       = data.archive_file.lambda.output_path
  source_code_hash               = data.archive_file.lambda.output_base64sha256
  role                           = aws_iam_role.lambda.arn
  handler                        = "index.handler"
  runtime                        = "nodejs22.x"
  architectures                  = ["arm64"]
  memory_size                    = 128
  timeout                        = 15
  reserved_concurrent_executions = 2

  environment {
    variables = {
      SENDER_EMAIL               = local.sender_email
      RECIPIENT_EMAIL            = var.recipient_email
      TURNSTILE_SECRET_PARAMETER = var.turnstile_secret_parameter_name
      ALLOWED_ORIGINS            = join(",", var.allowed_origins)
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.basic_logs,
    aws_iam_role_policy.contact,
    aws_cloudwatch_log_group.contact
  ]
}

resource "aws_apigatewayv2_api" "contact" {
  name          = local.name
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = var.allowed_origins
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.contact.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.contact.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "submit" {
  api_id    = aws_apigatewayv2_api.contact.id
  route_key = "POST /v1/inquiries"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.contact.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_rate_limit  = 2
    throttling_burst_limit = 5
  }
}

resource "aws_lambda_permission" "gateway" {
  statement_id  = "AllowContactHttpApi"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.contact.execution_arn}/*/POST/v1/inquiries"
}
