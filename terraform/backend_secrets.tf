# Generated ASM secret values
resource "random_password" "jwt_secret" {
  length  = 32
  special = false
}

resource "random_password" "internal_endpoint_secret" {
  length  = 32
  special = false
}

# ASM secrets
resource "aws_secretsmanager_secret" "jwt_secret_asm_secret" {
  name                    = "${var.app_name}-jwt-secret"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret" "internal_endpoint_secret_asm_secret" {
  name                    = "${var.app_name}-internal-endpoint-secret"
  recovery_window_in_days = 7
}

# Non-TF managed ASM secrets
data "aws_secretsmanager_secret" "wallet_sign_private_key_asm_secret" {
  name = "${var.app_name}-wallet-sign-private-key"
}

data "aws_secretsmanager_secret" "vault_root_token" {
  name = "${var.app_name}-vault/root-token"
}

# ASM secret versions
resource "aws_secretsmanager_secret_version" "jwt_secret_asm_secret_version" {
  secret_id     = aws_secretsmanager_secret.jwt_secret_asm_secret.id
  secret_string = random_password.jwt_secret.result
}

resource "aws_secretsmanager_secret_version" "internal_endpoint_secret_asm_secret_version" {
  secret_id     = aws_secretsmanager_secret.internal_endpoint_secret_asm_secret.id
  secret_string = random_password.internal_endpoint_secret.result
}
