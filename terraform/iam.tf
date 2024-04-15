resource "aws_iam_role" "ecs_service_role" {
  name = "${var.app_name}-ecs-service-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = "sts:AssumeRole",
        Principal = {
          Service = ["ecs-tasks.amazonaws.com"]
        }
      },
    ],
  })
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.app_name}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = "sts:AssumeRole",
        Principal = {
          Service = ["ecs-tasks.amazonaws.com"]
        }
      },
    ],
  })
}

resource "aws_iam_policy" "allow_read_secret" {
  name        = "${var.app_name}-read-secrets-policy"
  path        = "/"
  description = "Policy to read required secrets from AWS Secrets Manager."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "secretsmanager:GetSecretValue",
        Resource = aws_secretsmanager_secret.aurora_password_asm_secret.arn,
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy_attachments_read_secret" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_read_secret.arn
}
