terraform {
  backend "s3" {
    key    = "coredin-backend"
    region = "eu-west-1"
  }
}