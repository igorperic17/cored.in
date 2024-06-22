resource "aws_alb" "backend" {
  count           = var.use_lambda_backend ? 0 : 1
  name            = "${var.app_name}-backend-elb"
  internal        = false
  subnets         = aws_subnet.public[*].id
  security_groups = [aws_security_group.backend_elb[0].id]
}

resource "aws_alb_target_group" "backend" {
  count                = var.use_lambda_backend ? 0 : 1
  name                 = "${var.app_name}-backend-tg"
  port                 = var.backend_port
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
    path                = "/"
    healthy_threshold   = 5
    unhealthy_threshold = 5
    matcher             = "200"
    protocol            = "HTTP"
  }
}

resource "aws_alb_listener" "backend" {
  count             = var.use_lambda_backend ? 0 : 1
  load_balancer_arn = aws_alb.backend[0].id
  port              = var.backend_port
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.backend[0].id
    type             = "forward"
  }
}
