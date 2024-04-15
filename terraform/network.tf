
resource "aws_vpc" "default" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "CoredIn_VPC"
  }
}

resource "aws_subnet" "public" {
  count                   = length(var.db_availability_zones)
  vpc_id                  = aws_vpc.default.id
  cidr_block              = cidrsubnet(aws_vpc.default.cidr_block, 8, 1 + count.index)
  availability_zone       = var.db_availability_zones[count.index]
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
  count             = length(var.db_availability_zones)
  vpc_id            = aws_vpc.default.id
  cidr_block        = cidrsubnet(aws_vpc.default.cidr_block, 8, 1 + length(var.db_availability_zones) + count.index)
  availability_zone = var.db_availability_zones[count.index]
}

resource "aws_db_subnet_group" "aurora_subnet_group" {
  name       = "${var.app_name}-rds-arurora-cluster-subnet-group"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_security_group" "default" {
  name        = "${var.app_name}-rds-aurora-cluster-sg"
  description = "Allow inbound traffic to Aurora Cluster"
  vpc_id      = aws_vpc.default.id

  # All ports open within the VPC
  ingress {
    from_port   = 0
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
}