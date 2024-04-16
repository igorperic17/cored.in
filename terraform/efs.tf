resource "aws_efs_file_system" "wallet_api_data_efs" {
  creation_token = "wallet-api-data-efs"
}

resource "aws_efs_mount_target" "wallet_api_data_efs_mount_target" {
  count           = length(aws_subnet.private)
  file_system_id  = aws_efs_file_system.wallet_api_data_efs.id
  subnet_id       = aws_subnet.private[count.index].id
  security_groups = [aws_security_group.wallet_api_data_efs_mount_target_sg.id]
}
