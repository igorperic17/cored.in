# Network interfaces
data "aws_network_interfaces" "vault" {
  count = var.use_elbs ? 0 : 1
  tags = {
    "aws:ecs:serviceName" = aws_ecs_service.vault.name
  }
}

data "aws_network_interfaces" "wallet_api" {
  count = var.use_elbs ? 0 : 1
  tags = {
    "aws:ecs:serviceName" = aws_ecs_service.wallet_api.name
  }
}

data "aws_network_interfaces" "issuer_api" {
  count = var.use_elbs ? 0 : 1
  tags = {
    "aws:ecs:serviceName" = aws_ecs_service.issuer_api.name
  }
}

data "aws_network_interfaces" "verifier_api" {
  count = var.use_elbs ? 0 : 1
  tags = {
    "aws:ecs:serviceName" = aws_ecs_service.verifier_api.name
  }
}

# Network interface
data "aws_network_interface" "vault" {
  count      = var.use_elbs ? 0 : 1
  depends_on = [aws_ecs_service.vault]
  id         = data.aws_network_interfaces.vault[0].ids[0]
}

data "aws_network_interface" "wallet_api" {
  count      = var.use_elbs ? 0 : 1
  depends_on = [aws_ecs_service.wallet_api]
  id         = data.aws_network_interfaces.wallet_api[0].ids[0]
}

data "aws_network_interface" "issuer_api" {
  count      = var.use_elbs ? 0 : 1
  depends_on = [aws_ecs_service.issuer_api]
  id         = data.aws_network_interfaces.issuer_api[0].ids[0]
}

data "aws_network_interface" "verifier_api" {
  count      = var.use_elbs ? 0 : 1
  depends_on = [aws_ecs_service.verifier_api]
  id         = data.aws_network_interfaces.verifier_api[0].ids[0]
}

locals {
  app_port             = var.is_app_https ? 443 : 80
  app_protocol         = var.is_app_https ? "HTTPS" : "HTTP"
  vault_address        = var.use_elbs ? aws_alb.vault[0].dns_name : data.aws_network_interface.vault[0].private_ip
  wallet_api_address   = var.use_elbs ? aws_alb.wallet_api[0].dns_name : data.aws_network_interface.wallet_api[0].private_ip
  issuer_api_address   = var.use_elbs ? aws_alb.issuer_api[0].dns_name : data.aws_network_interface.issuer_api[0].private_ip
  verifier_api_address = var.use_elbs ? aws_alb.verifier_api[0].dns_name : data.aws_network_interface.verifier_api[0].private_ip
}