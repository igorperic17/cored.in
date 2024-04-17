
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
  count             = length(var.db_availability_zones)
  vpc_id            = aws_vpc.default.id
  cidr_block        = cidrsubnet(aws_vpc.default.cidr_block, 8, 1 + length(var.db_availability_zones) + count.index)
  availability_zone = var.db_availability_zones[count.index]
}

resource "aws_db_subnet_group" "aurora_subnet_group" {
  name       = "${var.app_name}-rds-aurora-cluster-subnet-group"
  subnet_ids = aws_subnet.public[*].id
}

resource "aws_security_group" "aurora_cluster" {
  name        = "${var.app_name}-rds-aurora-cluster-sg"
  description = "Allow inbound traffic to Aurora Cluster"
  vpc_id      = aws_vpc.default.id

  # All ports open within the VPC
  ingress {
    from_port   = 0
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] // TODO: 10.0.0.0/16 and IP address range of CI/CD
  }
}