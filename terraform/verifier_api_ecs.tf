resource "aws_ecs_cluster" "verifier_api" {
  name = "${var.app_name}-verifier-api-cluster"
}

resource "aws_ecs_cluster_capacity_providers" "verifier_api_capacity_providers" {
  cluster_name = aws_ecs_cluster.verifier_api.name

  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE_SPOT"
  }
}

resource "aws_ecs_task_definition" "verifier_api" {
  family                   = "${var.app_name}-verifier-api-task-definition"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.verifier_api_cpu
  memory                   = var.verifier_api_memory
  task_role_arn            = aws_iam_role.verifier_api_ecs_service_role.arn
  execution_role_arn       = aws_iam_role.verifier_api_ecs_execution_role.arn

  volume {
    name = "tmp-volume"
  }

  container_definitions = jsonencode([
    {
      cpu         = var.verifier_api_cpu
      image       = var.verifier_api_image
      memory      = var.verifier_api_memory
      name        = "${var.app_name}-verifier-api-container"
      networkMode = "awsvpc"
      logConfiguration = var.use_private_subnets ? null : {
        logDriver = "awslogs",
        options = {
          "awslogs-group" : "${aws_cloudwatch_log_group.ecs_log_group.name}",
          "awslogs-region" : "${var.region}",
          "awslogs-stream-prefix" : "ecs-verifier-api"
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
          containerPort = var.verifier_api_port
          hostPort      = var.verifier_api_port
        }
      ]
      environment = []
      secrets     = []
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${var.verifier_api_port}/openid4vc/policy-list || exit 1"],
        interval    = 30,
        timeout     = 5,
        retries     = 3,
        startPeriod = 60,
      }
    }
  ])
}

resource "aws_ecs_service" "verifier_api" {
  name             = "${var.app_name}-verifier-api-service"
  cluster          = aws_ecs_cluster.verifier_api.id
  task_definition  = aws_ecs_task_definition.verifier_api.arn
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
    security_groups  = [aws_security_group.verifier_api.id]
    subnets          = var.use_private_subnets ? aws_subnet.private.*.id : aws_subnet.public.*.id
    assign_public_ip = true
  }

  dynamic "load_balancer" {
    for_each = var.use_elbs ? [1] : []
    content {
      target_group_arn = aws_alb_target_group.verifier_api.arn
      container_name   = "${var.app_name}-verifier-api-container"
      container_port   = var.verifier_api_port
    }
  }

  depends_on = [aws_ecs_task_definition.verifier_api]
}
