resource "aws_alb" "verifier_api" {
  name            = "${var.app_name}-verifier-api-elb"
  internal        = true
  subnets         = var.use_private_subnets ? aws_subnet.private[*].id : aws_subnet.public[*].id
  security_groups = [aws_security_group.verifier_api_elb.id]
}

resource "aws_alb_target_group" "verifier_api" {
  name                 = "${var.app_name}-verifier-api-tg"
  port                 = var.verifier_api_port
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
    path                = "/openid4vc/policy-list"
    healthy_threshold   = 5
    unhealthy_threshold = 5
    matcher             = "200"
    protocol            = "HTTP"
  }
}

resource "aws_alb_listener" "verifier_api" {
  load_balancer_arn = aws_alb.verifier_api.id
  port              = var.verifier_api_port
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.verifier_api.id
    type             = "forward"
  }
}