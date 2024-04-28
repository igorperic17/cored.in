resource "aws_alb" "wallet_api" {
  name            = "${var.app_name}-wallet-api-elb"
  internal        = var.use_private_subnets
  subnets         = var.use_private_subnets ? aws_subnet.private[*].id : aws_subnet.public[*].id
  security_groups = [aws_security_group.wallet_api_elb.id]
}

resource "aws_alb_target_group" "wallet_api" {
  name                 = "${var.app_name}-wallet-api-target-group"
  port                 = var.wallet_api_port
  protocol             = "HTTP"
  vpc_id               = aws_vpc.default.id
  target_type          = "ip"
  deregistration_delay = 15

  lifecycle {
    create_before_destroy = true
    ignore_changes        = [name]
  }

  health_check {
    interval            = 15
    timeout             = 10
    path                = "/wallet-api/healthz"
    healthy_threshold   = 5
    unhealthy_threshold = 5
    matcher             = "200"
    protocol            = "HTTP"
  }
}

resource "aws_alb_listener" "wallet_api" {
  load_balancer_arn = aws_alb.wallet_api.id
  port              = var.wallet_api_port
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.wallet_api.id
    type             = "forward"
  }
}