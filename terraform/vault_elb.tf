resource "aws_alb" "vault" {
  name            = "${var.app_name}-vault-elb"
  internal        = true
  subnets         = var.use_private_subnets ? aws_subnet.private[*].id : aws_subnet.public[*].id
  security_groups = [aws_security_group.vault_elb.id]
}

resource "aws_alb_target_group" "vault" {
  name                 = "${var.app_name}-vault-tg"
  port                 = var.vault_port
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
    // TODO: Update health check.
    path                = "/.well-known/openid-configuration"
    healthy_threshold   = 5
    unhealthy_threshold = 5
    matcher             = "200"
    protocol            = "HTTP"
  }
}

resource "aws_alb_listener" "vault" {
  load_balancer_arn = aws_alb.vault.id
  port              = var.vault_port
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.vault.id
    type             = "forward"
  }
}