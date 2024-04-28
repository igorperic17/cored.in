data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/../lambda/build/index.js"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "unleash_proxy_lambda_dev" {
  filename         = "${path.module}/lambda.zip"
  function_name    = "${var.app_name}-dev"
  description      = "This Lambda function returns feature flags from Unleash (DEV)"
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  memory_size      = 256
  timeout          = 10
  role             = aws_iam_role.unleash_proxy_lambda_role.arn

  environment {
    variables = {
      REGION    = var.region
      API_TOKEN = var.api_token
      APP_NAME  = "DEV"
    }
  }
}

resource "aws_lambda_function" "unleash_proxy_lambda_prod" {
  filename         = "${path.module}/lambda.zip"
  function_name    = "${var.app_name}-prod"
  description      = "This Lambda function returns feature flags from Unleash (PROD)"
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  memory_size      = 256
  timeout          = 10
  role             = aws_iam_role.unleash_proxy_lambda_role.arn

  environment {
    variables = {
      REGION    = var.region
      API_TOKEN = var.api_token
      APP_NAME  = "PROD"
    }
  }
}

resource "aws_lambda_permission" "api_gateway_unleash_proxy_dev_api_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.unleash_proxy_lambda_dev.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.unleash_proxy_rest_api_dev.execution_arn}/*"
}

resource "aws_lambda_permission" "api_gateway_unleash_proxy_prod_api_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.unleash_proxy_lambda_prod.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.unleash_proxy_rest_api_prod.execution_arn}/*"
}
