locals {
  app_port     = var.is_app_https ? 443 : 80
  app_protocol = var.is_app_https ? "HTTPS" : "HTTP"
}