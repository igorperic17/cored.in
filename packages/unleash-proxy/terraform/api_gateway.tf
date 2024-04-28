resource "aws_api_gateway_rest_api" "unleash_proxy_rest_api_dev" {
  name        = "${var.app_name}-rest-api-dev"
  description = "REST API for Unleash Proxy (DEV)"
}

resource "aws_api_gateway_rest_api" "unleash_proxy_rest_api_prod" {
  name        = "${var.app_name}-rest-api-prod"
  description = "REST API for Unleash Proxy (PROD)"
}

resource "aws_api_gateway_resource" "features_resource_dev" {
  rest_api_id = aws_api_gateway_rest_api.unleash_proxy_rest_api_dev.id
  parent_id   = aws_api_gateway_rest_api.unleash_proxy_rest_api_dev.root_resource_id
  path_part   = "features"
}

resource "aws_api_gateway_resource" "features_resource_prod" {
  rest_api_id = aws_api_gateway_rest_api.unleash_proxy_rest_api_prod.id
  parent_id   = aws_api_gateway_rest_api.unleash_proxy_rest_api_prod.root_resource_id
  path_part   = "features"
}

resource "aws_api_gateway_method" "features_method_dev" {
  rest_api_id   = aws_api_gateway_rest_api.unleash_proxy_rest_api_dev.id
  resource_id   = aws_api_gateway_resource.features_resource_dev.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "features_method_prod" {
  rest_api_id   = aws_api_gateway_rest_api.unleash_proxy_rest_api_prod.id
  resource_id   = aws_api_gateway_resource.features_resource_prod.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "unleash_proxy_api_integration_dev" {
  rest_api_id             = aws_api_gateway_rest_api.unleash_proxy_rest_api_dev.id
  resource_id             = aws_api_gateway_resource.features_resource_dev.id
  http_method             = aws_api_gateway_method.features_method_dev.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.unleash_proxy_lambda_dev.invoke_arn
}

resource "aws_api_gateway_integration" "unleash_proxy_api_integration_prod" {
  rest_api_id             = aws_api_gateway_rest_api.unleash_proxy_rest_api_prod.id
  resource_id             = aws_api_gateway_resource.features_resource_prod.id
  http_method             = aws_api_gateway_method.features_method_prod.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.unleash_proxy_lambda_prod.invoke_arn
}

resource "aws_api_gateway_deployment" "unleash_proxy_rest_api_deployment_dev" {
  rest_api_id = aws_api_gateway_rest_api.unleash_proxy_rest_api_dev.id
  stage_name  = "dev"
}

resource "aws_api_gateway_deployment" "unleash_proxy_rest_api_deployment_prod" {
  rest_api_id = aws_api_gateway_rest_api.unleash_proxy_rest_api_prod.id
  stage_name  = "prod"
}
