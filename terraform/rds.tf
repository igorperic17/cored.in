resource "aws_rds_cluster" "aurora_cluster" {
  cluster_identifier      = "${var.app_name}-rds-aurora-cluster"
  engine                  = "aurora-postgresql"
  engine_version          = "16.1"
  database_name           = var.db_name
  master_username         = var.db_user
  master_password         = random_password.aurora_password.result
  backup_retention_period = 7
  preferred_backup_window = "03:00-05:00"
  skip_final_snapshot     = true

  db_subnet_group_name = aws_db_subnet_group.aurora_subnet_group.name

  vpc_security_group_ids = [aws_security_group.default.id]

  tags = {
    Name   = "CoredIn_Database"
    Engine = "Aurora_PostgreSQL"
  }
}

resource "random_password" "aurora_password" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret" "aurora_password_asm_secret" {
  name                    = "${var.app_name}-rds-aurora-cluster-password"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "aurora_password_asm_secret_version" {
  secret_id     = aws_secretsmanager_secret.aurora_password_asm_secret.id
  secret_string = aws_rds_cluster.aurora_cluster.master_password
}