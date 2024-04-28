terraform {
  backend "s3" {
    key    = "coredin-unleash-proxy"
    region = "eu-west-1"
  }
}
