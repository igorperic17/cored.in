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
      }
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

resource "aws_iam_policy" "allow_logs" {
  name        = "${var.app_name}-logs-policy"
  path        = "/"
  description = "Policy to interact with logs in CloudWatch."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "allow_read_secret" {
  name        = "${var.app_name}-read-secrets-policy"
  path        = "/"
  description = "Policy to read required secrets from AWS Secrets Manager."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow",
        Action   = "secretsmanager:GetSecretValue",
        Resource = "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:${var.app_name}-*",
      },
    ],
  })
}

resource "aws_iam_policy" "allow_read_ecr" {
  name        = "${var.app_name}-read-ecr-policy"
  path        = "/"
  description = "Policy to read images from AWS ECR."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
        ]
        Resource = "*",
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "ecs_service_role_policy_attachments_allow_ecr" {
  role       = aws_iam_role.ecs_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role_policy_attachment" "ecs_service_role_policy_attachments_allow_logs" {
  role       = aws_iam_role.ecs_service_role.name
  policy_arn = aws_iam_policy.allow_logs.arn
}

resource "aws_iam_role_policy_attachment" "ecs_service_role_policy_attachments_read_secret" {
  role       = aws_iam_role.ecs_service_role.name
  policy_arn = aws_iam_policy.allow_read_secret.arn
}

resource "aws_iam_role_policy_attachment" "ecs_service_role_policy_attachments_read_ecr" {
  role       = aws_iam_role.ecs_service_role.name
  policy_arn = aws_iam_policy.allow_read_ecr.arn
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy_attachments_allow_ecr" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy_attachments_allow_logs" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_logs.arn
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy_attachments_read_secret" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_read_secret.arn
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy_attachments_read_ecr" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_read_ecr.arn
}
