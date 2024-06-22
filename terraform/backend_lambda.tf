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

resource "aws_iam_role_policy_attachment" "lambda_backend_basic_execution_role" {
  role       = aws_iam_role.lambda_backend_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_backend_vpc_access_execution_role" {
  role       = aws_iam_role.lambda_backend_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "secret_access_attachment" {
  role       = aws_iam_role.lambda_backend_execution_role.name
  policy_arn = aws_iam_policy.backend_secrets_read_policy.arn
}

resource "aws_lambda_function" "lambda_backend" {
  count         = var.use_lambda_backend ? 1 : 0
  filename      = "../packages/backend/lambda.zip"
  function_name = "${var.app_name}-lambda-backend"
  runtime       = "nodejs20.x"
  handler       = "lambda.handler"
  role          = aws_iam_role.lambda_backend_execution_role.arn
  timeout       = 60
  layers = [
    "arn:aws:lambda:eu-west-1:015030872274:layer:AWS-Parameters-and-Secrets-Lambda-Extension:11",
  ]
  vpc_config {
    subnet_ids         = var.use_private_subnets ? aws_subnet.private[*].id : aws_subnet.public[*].id
    security_group_ids = [aws_security_group.lambda_backend.id]
  }
  environment {
    variables = {
      "CONFIGURATION_JSON" = jsonencode({
        secrets = {
          json_env_var = "SECRETS_JSON",
        },
        db = {
          host        = element(split(":", aws_db_instance.rds_instance.endpoint), 0),
          port        = aws_db_instance.rds_instance.port,
          user        = var.db_user,
          database    = var.db_name,
          synchronize = true,
          debug       = false,
        },
        vault = {
          api = {
            url = "http://${local.vault_address}:${var.vault_port}"
          }
        },
        wallet = {
          api = {
            url = "http://${local.wallet_api_address}:${var.wallet_api_port}"
          }
        },
        issuer = {
          api = {
            url = "http://${local.issuer_api_address}:${var.issuer_api_port}"
          }
        },
        verifier = {
          api = {
            url = "http://${local.verifier_api_address}:${var.verifier_api_port}"
          }
        }
      }),
      "SECRETS_JSON" = jsonencode({
        jwt_secret                = "sm://${aws_secretsmanager_secret.jwt_secret_asm_secret.arn}",
        internal_endpoint_secrets = "sm://${aws_secretsmanager_secret.internal_endpoint_secret_asm_secret.arn}",
        db_password               = "sm://${aws_secretsmanager_secret.rds_password_asm_secret.arn}",
        signer_pkey               = "sm://${data.aws_secretsmanager_secret.wallet_sign_private_key_asm_secret.arn}",
        vault_access_key          = "sm://${data.aws_secretsmanager_secret.vault_root_token.arn}",
      })
    }
  }
}

resource "aws_api_gateway_rest_api" "lambda_backend_api" {
  count = var.use_lambda_backend ? 1 : 0
  name  = "${var.app_name}-backend-api"
}

resource "aws_api_gateway_resource" "lambda_backend_api_proxy_resource" {
  count       = var.use_lambda_backend ? 1 : 0
  parent_id   = aws_api_gateway_rest_api.lambda_backend_api[0].root_resource_id
  path_part   = "{proxy+}"
  rest_api_id = aws_api_gateway_rest_api.lambda_backend_api[0].id
}

resource "aws_api_gateway_method" "lambda_backend_api_method" {
  count         = var.use_lambda_backend ? 1 : 0
  rest_api_id   = aws_api_gateway_rest_api.lambda_backend_api[0].id
  resource_id   = aws_api_gateway_resource.lambda_backend_api_proxy_resource[0].id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_backend_api_integration" {
  count                   = var.use_lambda_backend ? 1 : 0
  rest_api_id             = aws_api_gateway_rest_api.lambda_backend_api[0].id
  resource_id             = aws_api_gateway_resource.lambda_backend_api_proxy_resource[0].id
  http_method             = aws_api_gateway_method.lambda_backend_api_method[0].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_backend[0].invoke_arn
  depends_on              = [aws_lambda_function.lambda_backend]
}

resource "aws_api_gateway_method_response" "lambda_backend_api_method_response" {
  count       = var.use_lambda_backend ? 1 : 0
  rest_api_id = aws_api_gateway_rest_api.lambda_backend_api[0].id
  resource_id = aws_api_gateway_resource.lambda_backend_api_proxy_resource[0].id
  http_method = aws_api_gateway_method.lambda_backend_api_method[0].http_method
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "lambda_backend_api_integration_response" {
  count       = var.use_lambda_backend ? 1 : 0
  rest_api_id = aws_api_gateway_rest_api.lambda_backend_api[0].id
  resource_id = aws_api_gateway_resource.lambda_backend_api_proxy_resource[0].id
  http_method = aws_api_gateway_method.lambda_backend_api_method[0].http_method
  status_code = aws_api_gateway_method_response.lambda_backend_api_method_response[0].status_code

  response_templates = {
    "application/json" = ""
  }

  depends_on = [aws_api_gateway_method_response.lambda_backend_api_method_response]
}

resource "aws_api_gateway_deployment" "lambda_backend_api_deployment" {
  count       = var.use_lambda_backend ? 1 : 0
  rest_api_id = aws_api_gateway_rest_api.lambda_backend_api[0].id
  stage_name  = "prod"
}

resource "null_resource" "trigger_lambda_permission" {
  count       = var.use_lambda_backend ? 1 : 0
  triggers    = {
    lambda_version = aws_lambda_function.lambda_backend[0].version
  }
}


resource "aws_lambda_permission" "api_gateway_lambda_backend_api_permission" {
  count         = var.use_lambda_backend ? 1 : 0
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_backend[0].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.lambda_backend_api[0].execution_arn}/*"
  depends_on = [
    null_resource.trigger_lambda_permission,
    aws_api_gateway_integration.lambda_backend_api_integration,
    aws_lambda_function.lambda_backend
  ]

  lifecycle {
    replace_triggered_by = [null_resource.trigger_lambda_permission]
  }
}

resource "aws_api_gateway_rest_api_policy" "invoke_api_gateway_policy" {
  count       = var.use_lambda_backend ? 1 : 0
  rest_api_id = aws_api_gateway_rest_api.lambda_backend_api[0].id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Deny",
        Principal = "*",
        Action    = "execute-api:Invoke",
        Resource  = "${aws_api_gateway_rest_api.lambda_backend_api[0].execution_arn}/*",
        Condition = {
          StringNotEquals = {
            "aws:SourceArn" = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${var.backend_cloudfront_distribution_id}"
          }
        }
      }
    ]
  })
}
