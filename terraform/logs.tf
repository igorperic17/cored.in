resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name              = "${var.app_name}-logs"
  retention_in_days = var.wallet_api_logs_retention
}
