variable "region" {
  type    = string
  default = "eu-west-1"
}

variable "app_name" {
  type = string
}

variable "is_app_https" {
  type = bool
}

variable "use_private_subnets" {
  type = bool
}

variable "db_availability_zones" {
  type = list(string)
  default = [
    "eu-west-1a",
    "eu-west-1b",
    "eu-west-1c"
  ]
}

variable "db_name" {
  type = string
}

variable "db_user" {
  type = string
}

variable "db_engine_version" {
  type = string
}

variable "db_retention_window_days" {
  type = number
}

variable "wallet_api_db_name" {
  type = string
}

variable "api_domain_name" {
  type = string
}

variable "api_certificate_arn" {
  type = string
}

variable "wallet_api_image" {
  type = string
}

variable "wallet_api_cpu" {
  type        = number
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units) for Wallet API"
}

variable "wallet_api_memory" {
  type        = number
  description = "Fargate instance memory to provision (in MiB) for Wallet API"
}

variable "wallet_api_port" {
  type = number
}

variable "wallet_api_logs_retention" {
  type    = number
  default = 1
}