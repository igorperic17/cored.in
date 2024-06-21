
resource "aws_vpc" "default" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "coredin-vpc"
  }
}

resource "aws_subnet" "public" {
  count                   = length(var.db_availability_zones)
  vpc_id                  = aws_vpc.default.id
  cidr_block              = cidrsubnet(aws_vpc.default.cidr_block, 8, 1 + count.index)
  availability_zone       = var.db_availability_zones[count.index]
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
  count             = var.use_private_subnets ? length(var.db_availability_zones) : 0
  vpc_id            = aws_vpc.default.id
  cidr_block        = cidrsubnet(aws_vpc.default.cidr_block, 8, 1 + 3 + count.index)
  availability_zone = var.db_availability_zones[count.index]
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

resource "aws_db_subnet_group" "aurora_subnet_group" {
  name       = "${var.app_name}-rds-aurora-cluster-subnet-group"
  subnet_ids = var.use_private_subnets ? aws_subnet.private[*].id : aws_subnet.public[*].id
}

resource "aws_security_group" "aurora_cluster" {
  name        = "${var.app_name}-rds-aurora-cluster-sg"
  description = "Allow inbound traffic to Aurora Cluster"
  vpc_id      = aws_vpc.default.id

  ingress {
    from_port   = 0
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] // TODO: Rollback after adding VPN (var.use_private_subnets ? [] : ["0.0.0.0/0"])
  }
}

// TODO: Reconsider if NAT GW is really needed here.
resource "aws_eip" "nat_eip" {
  domain   = "vpc"
}

resource "aws_nat_gateway" "nat_gw" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "${var.app_name}-ngw"
  }
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.default.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw.id
  }
}

resource "aws_route_table_association" "private_rt_assoc" {
  count          = length(aws_subnet.private)
  subnet_id      = element(aws_subnet.private[*].id, count.index)
  route_table_id = aws_route_table.private_rt.id
}

# Wallet API
resource "aws_security_group" "wallet_api_elb" {
  name        = "${var.app_name}-wallet-api-elb-sg"
  description = "Allow inbound traffic to Wallet API ELB"
  vpc_id      = aws_vpc.default.id

  ingress {
    from_port   = var.wallet_api_port
    to_port     = var.wallet_api_port
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.default.cidr_block]
  }

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

  ingress {
    protocol        = "tcp"
    from_port       = 0
    to_port         = var.wallet_api_port
    security_groups = [aws_security_group.wallet_api_elb.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Verifier API
resource "aws_security_group" "verifier_api_elb" {
  name        = "${var.app_name}-verifier-api-elb-sg"
  description = "Allow inbound traffic to Verifier API ELB"
  vpc_id      = aws_vpc.default.id

  ingress {
    from_port   = var.verifier_api_port
    to_port     = var.verifier_api_port
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.default.cidr_block]
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
    security_groups = [aws_security_group.verifier_api_elb.id]
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
  name        = "${var.app_name}-issuer-api-elb-sg"
  description = "Allow inbound traffic to Issuer API ELB"
  vpc_id      = aws_vpc.default.id

  ingress {
    from_port   = var.issuer_api_port
    to_port     = var.issuer_api_port
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.default.cidr_block]
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
    security_groups = [aws_security_group.issuer_api_elb.id]
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
  name        = "${var.app_name}-vault-elb-sg"
  description = "Allow inbound traffic to Vault ELB"
  vpc_id      = aws_vpc.default.id

  ingress {
    from_port   = var.vault_port
    to_port     = var.vault_port
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.default.cidr_block]
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
    security_groups = [aws_security_group.vault_elb.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Backend
resource "aws_security_group" "lambda_backend" {
  name        = "${var.app_name}-lambda-backend-sg"
  description = "Allow outbound access for Lambda backend SG"
  vpc_id      = aws_vpc.default.id

  ingress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = [aws_vpc.default.cidr_block]
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
