app_name                 = "coredin"
is_app_https             = true
use_private_subnets      = false
db_instance_class        = "db.serverless"
db_availability_zones    = [
  "eu-west-1a",
  "eu-west-1b"
]
db_name                  = "coredinstaging"
db_user                  = "coredin_aurora_admin"
db_engine_version        = "16.1"
db_retention_window_days = 0
wallet_api_image         = "rubentewierik/wallet-api:x86"
wallet_api_db_name       = "coredinwalletapistaging"
wallet_api_cpu           = 256
wallet_api_memory        = 512
wallet_api_port          = 7001
