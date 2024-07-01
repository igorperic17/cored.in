# Wallet API
resource "aws_iam_role" "wallet_api_ecs_service_role" {
  name = "${var.app_name}-wallet-api-ecs-service-role"

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

resource "aws_iam_role" "wallet_api_ecs_execution_role" {
  name = "${var.app_name}-wallet-api-ecs-execution-role"

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

# Verifier API
resource "aws_iam_role" "verifier_api_ecs_service_role" {
  name = "${var.app_name}-verifier-api-ecs-service-role"

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

resource "aws_iam_role" "verifier_api_ecs_execution_role" {
  name = "${var.app_name}-verifier-api-ecs-execution-role"

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

# Issuer API
resource "aws_iam_role" "issuer_api_ecs_service_role" {
  name = "${var.app_name}-issuer-api-ecs-service-role"

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

resource "aws_iam_role" "issuer_api_ecs_execution_role" {
  name = "${var.app_name}-issuer-api-ecs-execution-role"

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

# Vault
resource "aws_iam_role" "vault_ecs_service_role" {
  name = "${var.app_name}-vault-ecs-service-role"

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

resource "aws_iam_role" "vault_ecs_execution_role" {
  name = "${var.app_name}-vault-ecs-execution-role"

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

resource "aws_iam_role" "vault_ecs_volume_role" {
  name = "${var.app_name}-vault-ecs-volume-role"

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
resource "aws_iam_role_policy_attachment" "vault_ecs_volume_role_policy_attachments_allow_ecs_volume" {
  role       = aws_iam_role.vault_ecs_volume_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSInfrastructureRolePolicyForVolumes"
}

# Backend
resource "aws_iam_role" "backend_ecs_service_role" {
  name = "${var.app_name}-backend-ecs-service-role"

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

resource "aws_iam_role" "backend_ecs_execution_role" {
  name = "${var.app_name}-backend-ecs-execution-role"

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
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Resource = "*"
      }
    ]
  })
}

// TODO: Split this policy into two separate policies: one for Wallet API, another one for Vault.
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
        Resource = "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:${var.app_name}-*"
      }
    ],
  })
}

resource "aws_iam_policy" "allow_read_vault_access_token" {
  name        = "${var.app_name}-read-vault-access-token-policy"
  path        = "/"
  description = "Policy to read the Vault access token secret from AWS Secrets Manager."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow",
        Action   = "secretsmanager:GetSecretValue",
        Resource = "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:${var.app_name}-vault/root-token",
      }
    ],
  })
}

resource "aws_iam_policy" "allow_vault_secrets_management" {
  name        = "${var.app_name}-manage-vault-secrets-policy"
  path        = "/"
  description = "Policy to manage the Vault secrets in AWS Secrets Manager."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "secretsmanager:CreateSecret",
          "secretsmanager:GetSecretValue",
          "secretsmanager:PutSecretValue"
        ],
        Resource = "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:${var.app_name}-vault/*",
      }
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

resource "aws_iam_policy" "allow_vault_key_usage" {
  name        = "${var.app_name}-vault-key-usage-policy"
  path        = "/"
  description = "Policy to use AWS KMS key for Vault."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:GenerateDataKey",
          "kms:DescribeKey"
        ]
        Resource = aws_kms_key.vault_kms_key.arn,
      },
    ],
  })
}

resource "aws_iam_policy" "backend_secrets_read_policy" {
  name        = "${var.app_name}-backend-secrets-read-policy"
  description = "IAM policy to allow access to secrets in Secrets Manager required by the backend"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = "secretsmanager:GetSecretValue",
        Resource = [
          aws_secretsmanager_secret.jwt_secret_asm_secret.arn,
          aws_secretsmanager_secret.internal_endpoint_secret_asm_secret.arn,
          aws_secretsmanager_secret.rds_password_asm_secret.arn,
          data.aws_secretsmanager_secret.wallet_sign_private_key_asm_secret.arn,
          data.aws_secretsmanager_secret.vault_root_token.arn
        ]
      },
    ],
  })
}

# Wallet API
resource "aws_iam_role_policy_attachment" "wallet_api_ecs_execution_role_policy_attachments_allow_ecr" {
  role       = aws_iam_role.wallet_api_ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role_policy_attachment" "wallet_api_ecs_execution_role_policy_attachments_allow_logs" {
  role       = aws_iam_role.wallet_api_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_logs.arn
}

resource "aws_iam_role_policy_attachment" "wallet_api_ecs_execution_role_policy_attachments_read_secret" {
  role       = aws_iam_role.wallet_api_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_read_secret.arn
}

resource "aws_iam_role_policy_attachment" "wallet_api_ecs_execution_role_policy_attachments_read_ecr" {
  role       = aws_iam_role.wallet_api_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_read_ecr.arn
}

# Verifier API
resource "aws_iam_role_policy_attachment" "verifier_api_ecs_execution_role_policy_attachments_allow_ecr" {
  role       = aws_iam_role.verifier_api_ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role_policy_attachment" "verifier_api_ecs_execution_role_policy_attachments_allow_logs" {
  role       = aws_iam_role.verifier_api_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_logs.arn
}

resource "aws_iam_role_policy_attachment" "verifier_api_ecs_execution_role_policy_attachments_read_ecr" {
  role       = aws_iam_role.verifier_api_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_read_ecr.arn
}

# Issuer API
resource "aws_iam_role_policy_attachment" "issuer_api_ecs_execution_role_policy_attachments_allow_ecr" {
  role       = aws_iam_role.issuer_api_ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role_policy_attachment" "issuer_api_ecs_execution_role_policy_attachments_allow_logs" {
  role       = aws_iam_role.issuer_api_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_logs.arn
}

resource "aws_iam_role_policy_attachment" "issuer_api_ecs_execution_role_policy_attachments_read_ecr" {
  role       = aws_iam_role.issuer_api_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_read_ecr.arn
}

# Vault
resource "aws_iam_role_policy_attachment" "vault_ecs_execution_role_policy_attachments_allow_ecr" {
  role       = aws_iam_role.vault_ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role_policy_attachment" "vault_ecs_execution_role_policy_attachments_allow_logs" {
  role       = aws_iam_role.vault_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_logs.arn
}

resource "aws_iam_role_policy_attachment" "vault_ecs_execution_role_policy_attachments_read_secret" {
  role       = aws_iam_role.vault_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_read_secret.arn
}

resource "aws_iam_role_policy_attachment" "vault_ecs_execution_role_policy_attachments_read_ecr" {
  role       = aws_iam_role.vault_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_read_ecr.arn
}

resource "aws_iam_role_policy_attachment" "vault_ecs_service_role_policy_attachments_vault_key_usage" {
  role       = aws_iam_role.vault_ecs_service_role.name
  policy_arn = aws_iam_policy.allow_vault_key_usage.arn
}

resource "aws_iam_role_policy_attachment" "vault_ecs_service_role_policy_attachments_vault_secrets_management" {
  role       = aws_iam_role.vault_ecs_service_role.name
  policy_arn = aws_iam_policy.allow_vault_secrets_management.arn
}

# Backend
resource "aws_iam_role_policy_attachment" "backend_ecs_execution_role_policy_attachments_allow_ecr" {
  role       = aws_iam_role.backend_ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role_policy_attachment" "backend_ecs_execution_role_policy_attachments_allow_logs" {
  role       = aws_iam_role.backend_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_logs.arn
}

resource "aws_iam_role_policy_attachment" "backend_ecs_execution_role_policy_attachments_read_ecr" {
  role       = aws_iam_role.backend_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_read_ecr.arn
}

resource "aws_iam_role_policy_attachment" "backend_ecs_execution_role_policy_attachments_backend_secrets_read" {
  role       = aws_iam_role.backend_ecs_execution_role.name
  policy_arn = aws_iam_policy.backend_secrets_read_policy.arn
}

# TODO: Should not be necessary.
resource "aws_iam_role_policy_attachment" "vault_ecs_execution_role_policy_attachments_vault_key_usage" {
  role       = aws_iam_role.vault_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_vault_key_usage.arn
}

resource "aws_iam_role_policy_attachment" "vault_ecs_execution_role_policy_attachments_vault_secrets_management" {
  role       = aws_iam_role.vault_ecs_execution_role.name
  policy_arn = aws_iam_policy.allow_vault_secrets_management.arn
}

resource "aws_iam_role_policy_attachment" "vault_ecs_service_role_policy_attachments_allow_logs" {
  role       = aws_iam_role.vault_ecs_service_role.name
  policy_arn = aws_iam_policy.allow_logs.arn
}
