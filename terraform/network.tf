// https://aws.amazon.com/blogs/networking-and-content-delivery/limit-access-to-your-origins-using-the-aws-managed-prefix-list-for-amazon-cloudfront/
data "aws_prefix_list" "cloudfront" {
  // com.amazonaws.global.cloudfront.origin-facing
  prefix_list_id = "pl-4fa04526"
}

resource "aws_vpc" "default" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "coredin-vpc"
  }
}

resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.default.id
  cidr_block              = cidrsubnet(aws_vpc.default.cidr_block, 8, 1 + count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.default.id

  tags = {
    Name = "${var.app_name}-igw"
  }
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_vpc.default.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gw.id
}

resource "aws_subnet" "private" {
  count             = var.use_private_subnets ? length(var.availability_zones) : 0
  vpc_id            = aws_vpc.default.id
  cidr_block        = cidrsubnet(aws_vpc.default.cidr_block, 8, 1 + 3 + count.index)
  availability_zone = var.availability_zones[count.index]
}

# VPC endpoints
resource "aws_vpc_endpoint" "secrets_manager_endpoint" {
  count               = var.use_vpc_endpoints ? 1 : 0
  vpc_id              = aws_vpc.default.id
  subnet_ids          = var.use_private_subnets ? aws_subnet.private[*].id : aws_subnet.public[*].id
  service_name        = "com.amazonaws.${var.region}.secretsmanager"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  security_group_ids = [
    aws_security_group.wallet_api.id,
    aws_security_group.lambda_backend.id,
  ]
}

resource "aws_vpc_endpoint" "kms_endpoint" {
  count               = var.use_vpc_endpoints ? 1 : 0
  vpc_id              = aws_vpc.default.id
  subnet_ids          = var.use_private_subnets ? aws_subnet.private[*].id : aws_subnet.public[*].id
  service_name        = "com.amazonaws.${var.region}.kms"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  security_group_ids = [
    aws_security_group.wallet_api.id,
    aws_security_group.lambda_backend.id,
  ]
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "${var.app_name}-rds-subnet-group"
  subnet_ids = var.use_private_subnets ? aws_subnet.private[*].id : aws_subnet.public[*].id
}

resource "aws_security_group" "rds" {
  name        = "${var.app_name}-rds-sg"
  description = "Allow inbound traffic to Aurora Cluster"
  vpc_id      = aws_vpc.default.id

  ingress {
    from_port   = 0
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] // TODO: Rollback after adding VPN (var.use_private_subnets ? [] : ["0.0.0.0/0"])
  }
}

resource "aws_eip" "nat_eip" {
  count  = var.use_lambda_backend ? 1 : 0
  domain = "vpc"
}

resource "aws_nat_gateway" "nat_gw" {
  count         = var.use_lambda_backend ? 1 : 0
  allocation_id = aws_eip.nat_eip[0].id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "${var.app_name}-ngw"
  }
}

resource "aws_route_table" "private_rt" {
  count  = var.use_lambda_backend ? 1 : 0
  vpc_id = aws_vpc.default.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw[0].id
  }
}

resource "aws_route_table_association" "private_rt_assoc" {
  count          = var.use_lambda_backend ? length(aws_subnet.private) : 0
  subnet_id      = element(aws_subnet.private[*].id, count.index)
  route_table_id = aws_route_table.private_rt[0].id
}

# Wallet API
resource "aws_security_group" "wallet_api_elb" {
  count       = var.use_elbs ? 1 : 0
  name        = "${var.app_name}-wallet-api-elb-sg"
  description = "Allow inbound traffic to Wallet API ELB"
  vpc_id      = aws_vpc.default.id

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "wallet_api" {
  name        = "${var.app_name}-wallet-api-ecs-sg"
  description = "Allow inbound access for Wallet API"
  vpc_id      = aws_vpc.default.id

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "allow_inbound_for_wallet_api" {
  for_each                 = var.use_elbs ? toset([aws_security_group.wallet_api_elb[0].id]) : toset([aws_security_group.backend.id, aws_security_group.lambda_backend.id, aws_security_group.issuer_api.id])
  type                     = "ingress"
  from_port                = 0
  to_port                  = var.wallet_api_port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.wallet_api.id
  source_security_group_id = each.key
}

resource "aws_security_group_rule" "allow_inbound_for_wallet_api_elb" {
  for_each                 = var.use_elbs ? toset([aws_security_group.backend.id, aws_security_group.lambda_backend.id, aws_security_group.issuer_api.id]) : toset([])
  type                     = "ingress"
  from_port                = var.wallet_api_port
  to_port                  = var.wallet_api_port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.wallet_api_elb[0].id
  source_security_group_id = each.key
}


# Verifier API
resource "aws_security_group" "verifier_api_elb" {
  count       = var.use_elbs ? 1 : 0
  name        = "${var.app_name}-verifier-api-elb-sg"
  description = "Allow inbound traffic to Verifier API ELB"
  vpc_id      = aws_vpc.default.id

  ingress {
    from_port       = var.verifier_api_port
    to_port         = var.verifier_api_port
    protocol        = "tcp"
    security_groups = [aws_security_group.backend.id, aws_security_group.lambda_backend.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "verifier_api" {
  name        = "${var.app_name}-verifier-api-ecs-sg"
  description = "Allow inbound access for Verifier API"
  vpc_id      = aws_vpc.default.id

  ingress {
    protocol        = "tcp"
    from_port       = 0
    to_port         = var.verifier_api_port
    security_groups = var.use_elbs ? [aws_security_group.verifier_api_elb[0].id] : [aws_security_group.backend.id, aws_security_group.lambda_backend.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Issuer API
resource "aws_security_group" "issuer_api_elb" {
  count       = var.use_elbs ? 1 : 0
  name        = "${var.app_name}-issuer-api-elb-sg"
  description = "Allow inbound traffic to Issuer API ELB"
  vpc_id      = aws_vpc.default.id

  ingress {
    protocol        = "tcp"
    from_port       = var.issuer_api_port
    to_port         = var.issuer_api_port
    security_groups = [aws_security_group.backend.id, aws_security_group.lambda_backend.id, aws_security_group.wallet_api.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "issuer_api" {
  name        = "${var.app_name}-issuer-api-ecs-sg"
  description = "Allow inbound access for Issuer API"
  vpc_id      = aws_vpc.default.id

  ingress {
    protocol        = "tcp"
    from_port       = 0
    to_port         = var.issuer_api_port
    security_groups = var.use_elbs ? [aws_security_group.issuer_api_elb[0].id] : [aws_security_group.backend.id, aws_security_group.lambda_backend.id, aws_security_group.wallet_api.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Vault
resource "aws_security_group" "vault_elb" {
  count       = var.use_elbs ? 1 : 0
  name        = "${var.app_name}-vault-elb-sg"
  description = "Allow inbound traffic to Vault ELB"
  vpc_id      = aws_vpc.default.id

  ingress {
    protocol        = "tcp"
    from_port       = var.vault_port
    to_port         = var.vault_port
    security_groups = [aws_security_group.wallet_api.id, aws_security_group.issuer_api.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "vault" {
  name        = "${var.app_name}-vault-ecs-sg"
  description = "Allow inbound access for Vault"
  vpc_id      = aws_vpc.default.id

  ingress {
    protocol        = "tcp"
    from_port       = 0
    to_port         = var.vault_port
    self            = var.use_vault_efs # Seems to be required for EFS mount
    security_groups = var.use_elbs ? [aws_security_group.vault_elb[0].id] : [aws_security_group.wallet_api.id, aws_security_group.issuer_api.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Backend
resource "aws_security_group" "backend_elb" {
  count       = var.use_lambda_backend ? 0 : 1
  name        = "${var.app_name}-backend-elb-sg"
  description = "Allow inbound traffic to backend ELB"
  vpc_id      = aws_vpc.default.id

  ingress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = data.aws_prefix_list.cloudfront.cidr_blocks
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "backend" {
  name        = "${var.app_name}-backend-sg"
  description = "Allow inbound access to backend"
  vpc_id      = aws_vpc.default.id

  ingress {
    protocol        = "-1"
    from_port       = 0
    to_port         = 0
    security_groups = [aws_security_group.backend_elb[0].id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Lambda Backend 
resource "aws_security_group" "lambda_backend" {
  name        = "${var.app_name}-lambda-backend-sg"
  description = "Allow outbound access for Lambda backend SG"
  vpc_id      = aws_vpc.default.id

  ingress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = [aws_vpc.default.cidr_block] // TODO: Set this source to API Gateway.
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "public_wallet_api_security_group_rule" {
  security_group_id = aws_security_group.wallet_api.id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 0
  to_port           = var.wallet_api_port
  cidr_blocks       = var.use_private_subnets ? [] : ["0.0.0.0/0"]
  count             = var.use_private_subnets ? 0 : 1
}
