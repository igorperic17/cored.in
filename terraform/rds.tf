resource "random_password" "rds_password" {
  length  = 32
  special = false
}

resource "aws_db_parameter_group" "rds_parameter_group" {
  name        = "${var.app_name}-rds-parameter-group"
  family      = "postgres16"
  description = "Parameter group for RDS instances"

  parameter {
    name  = "rds.force_ssl"
    value = "0"
  }
}

resource "aws_db_instance" "rds_instance" {
  identifier              = "${var.app_name}-rds"
  allocated_storage       = 10
  db_name                 = var.db_name
  engine                  = "postgres"
  engine_version          = var.db_engine_version
  instance_class          = var.db_instance_class
  username                = var.db_user
  password                = random_password.rds_password.result
  db_subnet_group_name    = aws_db_subnet_group.rds_subnet_group.name
  parameter_group_name    = aws_db_parameter_group.rds_parameter_group.name
  apply_immediately       = true
  publicly_accessible     = true // TODO: Rollback after adding VPN (var.use_private_subnets ? false : true)
  backup_retention_period = var.db_retention_window_days
  storage_encrypted       = true

  availability_zone = var.db_availability_zones[0]

  vpc_security_group_ids = [aws_security_group.rds.id]

  tags = {
    Name   = "coredin-rds-instance"
    Engine = "postgres"
  }
}

provider "postgresql" {
  scheme   = "awspostgres"
  host     = element(split(":", aws_db_instance.rds_instance.endpoint), 0)
  database = aws_db_instance.rds_instance.db_name
  username = var.db_user
  password = random_password.rds_password.result
}

provider "postgresql" {
  scheme   = "awspostgres"
  alias    = "wallet_api"
  host     = element(split(":", aws_db_instance.rds_instance.endpoint), 0)
  username = var.db_user
  password = random_password.rds_password.result
}

resource "postgresql_database" "wallet_api_database" {
  provider = postgresql.wallet_api
  name     = var.wallet_api_db_name
  owner    = var.db_user
}

resource "aws_secretsmanager_secret" "rds_password_asm_secret" {
  name                    = "${var.app_name}-rds-password"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "rds_password_asm_secret_version" {
  secret_id     = aws_secretsmanager_secret.rds_password_asm_secret.id
  secret_string = aws_db_instance.rds_instance.password
}
