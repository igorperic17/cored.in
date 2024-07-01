resource "aws_efs_file_system" "vault_efs_volume" {
  count            = var.use_vault_efs ? 1 : 0
  performance_mode = "generalPurpose"
  creation_token   = "vault-efs-volume"
  lifecycle_policy {
    transition_to_ia = "AFTER_7_DAYS"
  }

}

resource "aws_efs_mount_target" "vault_efs_mount_target" {
  for_each       = var.use_vault_efs ? (var.use_private_subnets ? toset(aws_subnet.private[*].id) : toset(aws_subnet.public[*].id)) : []
  file_system_id = aws_efs_file_system.vault_efs_volume[0].id
  subnet_id      = each.value
  security_groups = ["${aws_security_group.vault.id}"]
}
