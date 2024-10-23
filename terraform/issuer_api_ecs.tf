resource "aws_ecs_cluster" "issuer_api" {
  name = "${var.app_name}-issuer-api-cluster"
}

resource "aws_ecs_cluster_capacity_providers" "issuer_api_capacity_providers" {
  cluster_name = aws_ecs_cluster.issuer_api.name

  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE_SPOT"
  }
}

resource "aws_ecs_task_definition" "issuer_api" {
  family                   = "${var.app_name}-issuer-api-task-definition"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.issuer_api_cpu
  memory                   = var.issuer_api_memory
  task_role_arn            = aws_iam_role.issuer_api_ecs_service_role.arn
  execution_role_arn       = aws_iam_role.issuer_api_ecs_execution_role.arn

  volume {
    name = "tmp-volume"
  }

  container_definitions = jsonencode([
    {
      cpu         = var.issuer_api_cpu
      image       = var.issuer_api_image
      memory      = var.issuer_api_memory
      name        = "${var.app_name}-issuer-api-container"
      networkMode = "awsvpc"
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group" : "${aws_cloudwatch_log_group.ecs_log_group.name}",
          "awslogs-region" : "${var.region}",
          "awslogs-stream-prefix" : "ecs-issuer-api"
        }
      }
      mountPoints = [
        {
          readOnly      = false
          sourceVolume  = "tmp-volume"
          containerPath = "/tmp"
        }
      ]
      portMappings = [
        {
          containerPort = var.issuer_api_port
          hostPort      = var.issuer_api_port
        }
      ]
      environment = var.use_elbs ? [
        {
          name  = "ELB_ADDRESS"
          value = aws_alb.issuer_api[0].dns_name
        }
      ] : []
      secrets = []
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${var.issuer_api_port}/.well-known/openid-configuration || exit 1"],
        interval    = 30,
        timeout     = 5,
        retries     = 3,
        startPeriod = 60,
      }
    }
  ])
}

resource "aws_ecs_service" "issuer_api" {
  name             = "${var.app_name}-issuer-api-service"
  cluster          = aws_ecs_cluster.issuer_api.id
  task_definition  = aws_ecs_task_definition.issuer_api.arn
  desired_count    = 1
  platform_version = "1.3.0"
  propagate_tags   = "SERVICE"

  enable_ecs_managed_tags = true
  wait_for_steady_state   = true

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }

  network_configuration {
    security_groups  = [aws_security_group.issuer_api.id]
    subnets          = var.use_private_subnets ? aws_subnet.private.*.id : aws_subnet.public.*.id
    assign_public_ip = true
  }

  dynamic "load_balancer" {
    for_each = var.use_elbs ? [1] : []
    content {
      target_group_arn = aws_alb_target_group.issuer_api[0].arn
      container_name   = "${var.app_name}-issuer-api-container"
      container_port   = var.issuer_api_port
    }
  }

  depends_on = [aws_ecs_task_definition.issuer_api]
}
