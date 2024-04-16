resource "aws_ecs_cluster" "wallet_api" {
  name = "${var.app_name}-wallet-api-cluster"
}

resource "aws_ecs_task_definition" "wallet_api" {
  family                   = "${var.app_name}-wallet-api-task-definition"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.wallet_api_cpu
  memory                   = var.wallet_api_memory
  task_role_arn            = aws_iam_role.ecs_service_role.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  volume {
    name = "tmp-volume"
  }

  volume {
    name = "data-efs-volume"

    efs_volume_configuration {
      file_system_id = aws_efs_file_system.wallet_api_data_efs.id
      root_directory = "/"
      transit_encryption = "ENABLED"
    }
  }

  container_definitions = jsonencode([
    {
      cpu                    = var.wallet_api_cpu
      image                  = var.wallet_api_image
      memory                 = var.wallet_api_memory
      name                   = "${var.app_name}-wallet-api-container"
      networkMode            = "awsvpc"
      readonlyRootFilesystem = true
      mountPoints = [
        {
          readOnly      = false
          sourceVolume  = "tmp-volume"
          containerPath = "/tmp"
        },
        {
          readOnly      = false
          sourceVolume  = "data-efs-volume"
          containerPath = "/waltid-wallet-api/data"
        }
      ]
      portMappings = [
        {
          containerPort = local.app_port
          hostPort      = local.app_port
        }
      ]
      environment = []
      secrets     = []
    }
  ])
}

resource "aws_ecs_service" "wallet_api" {
  name             = "${var.app_name}-wallet-api-service"
  cluster          = aws_ecs_cluster.wallet_api.id
  task_definition  = aws_ecs_task_definition.wallet_api.arn
  desired_count    = 1
  launch_type      = "FARGATE"
  platform_version = "1.4.0"
  propagate_tags   = "SERVICE"

  network_configuration {
    security_groups  = [aws_security_group.wallet_api.id]
    subnets          = aws_subnet.private.*.id
    assign_public_ip = false
  }

  depends_on = [aws_ecs_task_definition.wallet_api]
}

resource "aws_security_group" "wallet_api" {
  name        = "${var.app_name}-wallet-api-sg-ecs"
  description = "Allow inbound access for Wallet API"
  vpc_id      = aws_vpc.default.id

  ingress {
    protocol    = "tcp"
    from_port   = local.app_port
    to_port     = local.app_port
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol        = "tcp"
    from_port       = local.app_port
    to_port         = local.app_port
    security_groups = [aws_security_group.api.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "api" {
  name        = "${var.app_name}-api-sg-ecs"
  description = "Allow inbound access for API"
  vpc_id      = aws_vpc.default.id

  ingress {
    protocol    = "tcp"
    from_port   = "443"
    to_port     = "443"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}