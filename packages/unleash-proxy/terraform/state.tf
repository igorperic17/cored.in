terraform {
  backend "s3" {
    profile = "coredin"
    key    = "coredin-unleash-proxy"
    region = "eu-west-1"
  }
}
