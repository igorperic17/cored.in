provider "aws" {
  region = var.region
  profile = "coredin"
}

provider "random" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.44"
    }
    random = {
      version = "3.6"
    }
  }
}