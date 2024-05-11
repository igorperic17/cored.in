app_name                 = "coredin"
is_app_https             = true
use_private_subnets      = true
db_instance_class        = "db.serverless"
db_availability_zones    = [
  "eu-west-1a",
  "eu-west-1b"
]
db_name                  = "coredinprod"
db_user                  = "coredin_aurora_admin"
db_engine_version        = "16.1"
db_retention_window_days = 0
wallet_api_image         = "730335564744.dkr.ecr.eu-west-1.amazonaws.com/coredin/waltid-wallet-api:x86"
wallet_api_db_name       = "coredinwalletapiprod"
wallet_api_cpu           = 256
wallet_api_memory        = 512
wallet_api_port          = 7001
