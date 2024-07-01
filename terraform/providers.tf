provider "aws" {
  region = var.region
}

provider "random" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.56"
    }
    random = {
      version = "3.6"
    }
    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "1.22"
    }
  }
}
