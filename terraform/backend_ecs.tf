# ECS Cluster
resource "aws_ecs_cluster" "backend" {
  count = var.use_lambda_backend ? 0 : 1
  name  = "${var.app_name}-backend-cluster"
}

resource "aws_ecs_cluster_capacity_providers" "backend_capacity_providers" {
  count        = var.use_lambda_backend ? 0 : 1
  cluster_name = aws_ecs_cluster.backend[0].name

  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE_SPOT"
  }
}

resource "aws_ecs_task_definition" "backend" {
  count                    = var.use_lambda_backend ? 0 : 1
  family                   = "${var.app_name}-backend-task-definition"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.backend_cpu
  memory                   = var.backend_memory
  task_role_arn            = aws_iam_role.backend_ecs_service_role.arn
  execution_role_arn       = aws_iam_role.backend_ecs_execution_role.arn

  volume {
    name = "tmp-volume"
  }

  container_definitions = jsonencode([
    {
      cpu         = var.backend_cpu
      image       = var.backend_image
      memory      = var.backend_memory
      name        = "${var.app_name}-backend-container"
      networkMode = "awsvpc"
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group" : "${aws_cloudwatch_log_group.ecs_log_group.name}",
          "awslogs-region" : "${var.region}",
          "awslogs-stream-prefix" : "ecs-backend"
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
          containerPort = var.backend_port
          hostPort      = var.backend_port
        }
      ]
      environment = [
        {
          name = "CONFIGURATION_JSON",
          value = jsonencode({
            secrets = {
              json_env_var = "SECRETS_JSON",
            },
            db = {
              host        = element(split(":", aws_db_instance.rds_instance.endpoint), 0),
              port        = aws_db_instance.rds_instance.port,
              user        = var.db_user,
              database    = var.db_name,
              synchronize = true,
              debug       = false,
            },
            vault = {
              api = {
                url = "http://${local.vault_address}:${var.vault_port}"
              }
            },
            wallet = {
              api = {
                url = "http://${local.wallet_api_address}:${var.wallet_api_port}"
              }
            },
            issuer = {
              api = {
                url = "http://${local.issuer_api_address}:${var.issuer_api_port}"
              }
            },
            verifier = {
              api = {
                url = "http://${local.verifier_api_address}:${var.verifier_api_port}"
              }
            },
            unleash = {
              url     = "https://gitlab.com/api/v4/feature_flags/unleash/56592491/"
              appName = "production"
            }
          })
        },
        {
          name = "SECRETS_JSON",
          value = jsonencode({
            jwt_secret                = "ENV_SECRET_1",
            internal_endpoint_secrets = "ENV_SECRET_2",
            db_password               = "ENV_SECRET_3",
            signer_pkey               = "ENV_SECRET_4",
            vault_access_key          = "ENV_SECRET_5",
            unleash_instance_id       = "ENV_SECRET_6"
          })
        }
      ]
      secrets = [
        {
          name      = "jwt_secret",
          valueFrom = aws_secretsmanager_secret.jwt_secret_asm_secret.arn
        },
        {
          name      = "internal_endpoint_secrets",
          valueFrom = aws_secretsmanager_secret.internal_endpoint_secret_asm_secret.arn
        },
        {
          name      = "db_password",
          valueFrom = aws_secretsmanager_secret.rds_password_asm_secret.arn
        },
        {
          name      = "signer_pkey",
          valueFrom = data.aws_secretsmanager_secret.wallet_sign_private_key_asm_secret.arn
        },
        {
          name      = "vault_access_key",
          valueFrom = data.aws_secretsmanager_secret.vault_root_token.arn
        },
        {
          name      = "unleash_instance_id",
          valueFrom = data.aws_secretsmanager_secret.unleash_instance_id_asm_secret.arn
        }
      ]
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${var.backend_port} || exit 1"],
        interval    = 30,
        timeout     = 5,
        retries     = 3,
        startPeriod = 60,
      }
    }
  ])
}

resource "aws_ecs_service" "backend" {
  count            = var.use_lambda_backend ? 0 : 1
  name             = "${var.app_name}-backend-service"
  cluster          = aws_ecs_cluster.backend[0].id
  task_definition  = aws_ecs_task_definition.backend[0].arn
  desired_count    = 1
  platform_version = "1.3.0"
  propagate_tags   = "SERVICE"

  enable_ecs_managed_tags = true

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }

  network_configuration {
    security_groups  = [aws_security_group.backend.id]
    subnets          = var.use_private_subnets ? aws_subnet.private.*.id : aws_subnet.public.*.id
    assign_public_ip = true
  }

  dynamic "load_balancer" {
    for_each = var.use_lambda_backend ? [] : [1]
    content {
      target_group_arn = aws_alb_target_group.backend[0].arn
      container_name   = "${var.app_name}-backend-container"
      container_port   = var.backend_port
    }
  }

  depends_on = [aws_ecs_task_definition.backend, aws_ecs_task_definition.wallet_api, aws_ecs_task_definition.issuer_api, aws_ecs_task_definition.verifier_api, aws_ecs_task_definition.vault]
}
