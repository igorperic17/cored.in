resource "aws_kms_key" "vault_kms_key" {
  description              = "KMS key for managing the Vault that persists Wallet API secrets"
  key_usage                = "ENCRYPT_DECRYPT"
  customer_master_key_spec = "SYMMETRIC_DEFAULT"
  deletion_window_in_days  = 7
}

resource "aws_ecs_cluster" "vault" {
  name = "${var.app_name}-vault-cluster"
}

resource "aws_ecs_cluster_capacity_providers" "vault_capacity_providers" {
  cluster_name = aws_ecs_cluster.vault.name

  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE_SPOT"
  }
}

resource "aws_ecs_task_definition" "vault" {
  family                   = "${var.app_name}-vault-task-definition"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.vault_cpu
  memory                   = var.vault_memory
  task_role_arn            = aws_iam_role.vault_ecs_service_role.arn
  execution_role_arn       = aws_iam_role.vault_ecs_execution_role.arn

  dynamic "volume" {
    for_each = var.use_vault_efs ? [1] : []
    content {
      name = "efs_temp"
      efs_volume_configuration {
        file_system_id = aws_efs_file_system.vault_efs_volume[0].id
        root_directory = "/"
      }
    }
  }

  container_definitions = jsonencode([
    {
      cpu         = var.vault_cpu
      image       = var.vault_image
      memory      = var.vault_memory
      name        = "${var.app_name}-vault-container"
      networkMode = "awsvpc"
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group" : "${aws_cloudwatch_log_group.ecs_log_group.name}",
          "awslogs-region" : "${var.region}",
          "awslogs-stream-prefix" : "ecs-vault"
        }
      }
      mountPoints = [
        {
          readOnly      = false
          sourceVolume  = "efs_temp"
          containerPath = "/vault/data"
        }
      ]
      portMappings = [
        {
          containerPort = var.vault_port
          hostPort      = var.vault_port
        }
      ]
      environment = [
        {
          name  = "AWS_REGION",
          value = var.region
        },
        {
          name  = "VAULT_SEAL_TYPE",
          value = "awskms"
        },
        {
          name  = "VAULT_AWSKMS_SEAL_KEY_ID",
          value = aws_kms_key.vault_kms_key.id
        },
        {
          name  = "AWS_KMS_ENDPOINT",
          value = var.use_vpc_endpoints ? aws_vpc_endpoint.kms_endpoint[0].dns_entry[0].dns_name : "https://kms.${var.region}.amazonaws.com"
        }
        // TODO: Add AWS credentials if needed.
      ]
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${var.vault_port}/v1/sys/health || exit 1"],
        interval    = 30,
        timeout     = 5,
        retries     = 3,
        startPeriod = 60,
      }
    }
  ])
}

resource "aws_ecs_service" "vault" {
  name             = "${var.app_name}-vault-service"
  cluster          = aws_ecs_cluster.vault.id
  task_definition  = aws_ecs_task_definition.vault.arn
  desired_count    = 1
  platform_version = "1.4.0"
  propagate_tags   = "SERVICE"

  enable_ecs_managed_tags = true
  wait_for_steady_state   = true

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }

  network_configuration {
    security_groups  = [aws_security_group.vault.id]
    subnets          = var.use_private_subnets ? aws_subnet.private.*.id : aws_subnet.public.*.id
    assign_public_ip = true
  }

  dynamic "load_balancer" {
    for_each = var.use_elbs ? [1] : []
    content {
      target_group_arn = aws_alb_target_group.vault[0].arn
      container_name   = "${var.app_name}-vault-container"
      container_port   = var.vault_port
    }
  }

  depends_on = [aws_ecs_task_definition.vault]
}
