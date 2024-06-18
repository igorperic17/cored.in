resource "aws_alb" "issuer_api" {
  name            = "${var.app_name}-issuer-api-elb"
  internal        = true
  subnets         = var.use_private_subnets ? aws_subnet.private[*].id : aws_subnet.public[*].id
  security_groups = [aws_security_group.issuer_api_elb.id]
}

resource "aws_alb_target_group" "issuer_api" {
  name                 = "${var.app_name}-issuer-api-tg"
  port                 = var.issuer_api_port
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
    path                = "/.well-known/openid-configuration"
    healthy_threshold   = 5
    unhealthy_threshold = 5
    matcher             = "200"
    protocol            = "HTTP"
  }
}

resource "aws_alb_listener" "issuer_api" {
  load_balancer_arn = aws_alb.issuer_api.id
  port              = var.issuer_api_port
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.issuer_api.id
    type             = "forward"
  }
}