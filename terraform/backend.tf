resource "random_password" "jwt_secret" {
  length  = 32
  special = false
}

resource "aws_secretsmanager_secret" "jwt_secret_asm_secret" {
  name                    = "${var.app_name}-jwt-secret"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "jwt_secret_asm_secret_version" {
  secret_id     = aws_secretsmanager_secret.jwt_secret_asm_secret.id
  secret_string = random_password.jwt_secret.result
}

resource "aws_iam_role" "lambda_backend_execution_role" {
  name = "${var.app_name}-lambda-backend-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution_role" {
  role       = aws_iam_role.lambda_backend_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "lambda_backend" {
  filename      = "../packages/backend/dist.zip"
  function_name = "${var.app_name}-lambda-backend"
  runtime       = "nodejs20.x"
  handler       = "lambda.handler"
  role          = aws_iam_role.lambda_backend_execution_role.arn
  layers = [
    "arn:aws:lambda:eu-west-1:015030872274:layer:AWS-Parameters-and-Secrets-Lambda-Extension:11",
  ]
  vpc_config {
    subnet_ids         = var.use_private_subnets ? aws_subnet.private[*].id : aws_subnet.public[*].id
    security_group_ids = [aws_vpc.default.default_security_group_id]
  }
  environment {
    variables = {
      "CONFIGURATION_JSON" = jsonencode({
        secrets = {
          file_path   = "",
          json_env_var = "SECRETS_JSON",
        },
        db = {
          host         = aws_rds_cluster_instance.aurora_instance.endpoint,
          port         = aws_rds_cluster_instance.aurora_instance.port,
          user         = var.db_user,
          database     = var.db_name,
          synchronize  = true,
          debug        = false,
        },
      }),
      "SECRETS_JSON" = jsonencode({
        jwt_secret  = "sm://${aws_secretsmanager_secret.jwt_secret_asm_secret.arn}",
        db_password = "sm://${aws_secretsmanager_secret.aurora_password_asm_secret.arn}"
      })
    }
  }
}

resource "aws_apigatewayv2_api" "lambda_backend_api" {
  name          = "${var.app_name}-backend-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_backend_main_integration" {
  api_id             = aws_apigatewayv2_api.lambda_backend_api.id
  integration_type   = "AWS_PROXY"
  integration_method = "ANY"
  integration_uri    = aws_lambda_function.lambda_backend.invoke_arn
}

resource "aws_apigatewayv2_route" "root_route" {
  api_id    = aws_apigatewayv2_api.lambda_backend_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_backend_main_integration.id}"
}

resource "aws_apigatewayv2_route" "proxy_route" {
  api_id    = aws_apigatewayv2_api.lambda_backend_api.id
  route_key = "{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_backend_main_integration.id}"
}
