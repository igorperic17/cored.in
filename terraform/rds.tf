resource "random_password" "aurora_password" {
  length  = 32
  special = false
}

resource "aws_rds_cluster_parameter_group" "aurora_cluster_parameter_group" {
  name        = "${var.app_name}-rds-aurora-cluster-parameter-group"
  family      = "aurora-postgresql16"
  description = "Parameter group for Aurora RDS cluster"

  parameter {
    name  = "rds.force_ssl"
    value = "0"
  }
}

resource "aws_rds_cluster" "aurora_cluster" {
  cluster_identifier      = "${var.app_name}-rds-aurora-cluster"
  engine                  = "aurora-postgresql"
  engine_mode             = "provisioned"
  engine_version          = "16.1"
  database_name           = var.db_name
  master_username         = var.db_user
  master_password         = random_password.aurora_password.result
  backup_retention_period = 7
  preferred_backup_window = "03:00-05:00"
  skip_final_snapshot     = true

  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 1.0
  }

  db_subnet_group_name            = aws_db_subnet_group.aurora_subnet_group.name
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.aurora_cluster_parameter_group.name

  vpc_security_group_ids = [aws_security_group.aurora_cluster.id]

  tags = {
    Name   = "coredin-rds-aurora-cluster"
    Engine = "aurora-postgresql"
  }
}

resource "aws_rds_cluster_instance" "aurora_instance" {
  cluster_identifier  = aws_rds_cluster.aurora_cluster.id
  engine              = aws_rds_cluster.aurora_cluster.engine
  engine_version      = aws_rds_cluster.aurora_cluster.engine_version
  instance_class      = var.db_instance_class
  apply_immediately   = true
  publicly_accessible = true // TODO: Rollback after adding VPN (var.use_private_subnets ? false : true)

  tags = {
    Name   = "coredin-rds-aurora-instance"
    Engine = "aurora-postgresql"
  }
}

provider "postgresql" {
  host     = aws_rds_cluster_instance.aurora_instance.endpoint
  database = aws_rds_cluster.aurora_cluster.database_name
  username = var.db_user
  password = random_password.aurora_password.result
}

// TODO: This should not be commented, but adding the NAT GW made this instance unreachable. To be fixed.
# resource "postgresql_database" "wallet_api_database" {
#   name  = var.wallet_api_db_name
#   owner = var.db_user
# }

resource "aws_secretsmanager_secret" "aurora_password_asm_secret" {
  name                    = "${var.app_name}-rds-password"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "aurora_password_asm_secret_version" {
  secret_id     = aws_secretsmanager_secret.aurora_password_asm_secret.id
  secret_string = aws_rds_cluster.aurora_cluster.master_password
}
