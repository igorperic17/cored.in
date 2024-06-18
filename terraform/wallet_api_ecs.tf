resource "random_password" "encryption_key" {
  length  = 16
  special = false
}

resource "random_password" "sign_key" {
  length  = 16
  special = false
}

resource "random_password" "token_key" {
  length  = 32
  special = false
}

resource "aws_secretsmanager_secret" "encryption_key_asm_secret" {
  name                    = "${var.app_name}-encryption-key"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret" "sign_key_asm_secret" {
  name                    = "${var.app_name}-sign-key"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret" "token_key_asm_secret" {
  name                    = "${var.app_name}-token-key"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "encryption_key_asm_secret_version" {
  secret_id     = aws_secretsmanager_secret.encryption_key_asm_secret.id
  secret_string = random_password.encryption_key.result
}

resource "aws_secretsmanager_secret_version" "sign_key_asm_secret_version" {
  secret_id     = aws_secretsmanager_secret.sign_key_asm_secret.id
  secret_string = random_password.sign_key.result
}

resource "aws_secretsmanager_secret_version" "token_key_asm_secret_version" {
  secret_id     = aws_secretsmanager_secret.token_key_asm_secret.id
  secret_string = random_password.token_key.result
}

resource "aws_ecs_cluster" "wallet_api" {
  name = "${var.app_name}-wallet-api-cluster"
}

resource "aws_ecs_cluster_capacity_providers" "example" {
  cluster_name = aws_ecs_cluster.wallet_api.name

  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE_SPOT"
  }
}

resource "aws_ecs_task_definition" "wallet_api" {
  family                   = "${var.app_name}-wallet-api-task-definition"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.wallet_api_cpu
  memory                   = var.wallet_api_memory
  task_role_arn            = aws_iam_role.wallet_api_ecs_service_role.arn
  execution_role_arn       = aws_iam_role.wallet_api_ecs_execution_role.arn

  volume {
    name = "tmp-volume"
  }

  container_definitions = jsonencode([
    {
      cpu         = var.wallet_api_cpu
      image       = var.wallet_api_image
      memory      = var.wallet_api_memory
      name        = "${var.app_name}-wallet-api-container"
      networkMode = "awsvpc"
      logConfiguration = var.use_private_subnets ? null : {
        logDriver = "awslogs",
        options = {
          "awslogs-group" : "${aws_cloudwatch_log_group.ecs_log_group.name}",
          "awslogs-region" : "${var.region}",
          "awslogs-stream-prefix" : "ecs-wallet-api"
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
          containerPort = var.wallet_api_port
          hostPort      = var.wallet_api_port
        }
      ]
      environment = [
        {
          name  = "DB_URL",
          value = "${aws_rds_cluster_instance.aurora_instance.endpoint}:${aws_rds_cluster_instance.aurora_instance.port}/${var.db_name}"
        },
        {
          name  = "DB_USER",
          value = "${var.db_user}"
        }
      ]
      secrets = [
        {
          name      = "AUTH_ENCRYPTION_KEY",
          valueFrom = aws_secretsmanager_secret.encryption_key_asm_secret.arn
        },
        {
          name      = "AUTH_SIGN_KEY",
          valueFrom = aws_secretsmanager_secret.sign_key_asm_secret.arn
        },
        {
          name      = "AUTH_TOKEN_KEY",
          valueFrom = aws_secretsmanager_secret.token_key_asm_secret.arn
        },
        {
          name      = "DB_PASS",
          valueFrom = aws_secretsmanager_secret.aurora_password_asm_secret.arn
        }
      ]
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${var.wallet_api_port}/wallet-api/healthz || exit 1"],
        interval    = 30,
        timeout     = 5,
        retries     = 3,
        startPeriod = 60,
      }
    }
  ])
}

resource "aws_ecs_service" "wallet_api" {
  name             = "${var.app_name}-wallet-api-service"
  cluster          = aws_ecs_cluster.wallet_api.id
  task_definition  = aws_ecs_task_definition.wallet_api.arn
  desired_count    = 1
  platform_version = "1.3.0"
  propagate_tags   = "SERVICE"

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }

  network_configuration {
    security_groups  = [aws_security_group.wallet_api.id]
    subnets          = var.use_private_subnets ? aws_subnet.private.*.id : aws_subnet.public.*.id
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.wallet_api.arn
    container_name   = "${var.app_name}-wallet-api-container"
    container_port   = var.wallet_api_port
  }

  depends_on = [aws_ecs_task_definition.wallet_api]
}
