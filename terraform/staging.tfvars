app_name                           = "coredin"
is_app_https                       = true
use_private_subnets                = false
use_vpc_endpoints                  = false
use_elbs                           = false
backend_cloudfront_distribution_id = "E2QVW1DECAJA80"
availability_zones                 = ["eu-west-1a", "eu-west-1b"]

db_instance_class                  = "db.t3.micro"
db_availability_zones = [
  "eu-west-1a"
]
db_name                  = "coredinstaging"
db_user                  = "coredin_rds_admin"
db_engine_version        = "16.1"
db_retention_window_days = 0

wallet_api_image   = "rubentewierik/wallet-api:x86"
wallet_api_db_name = "coredinwalletapistaging"
wallet_api_cpu     = 256
wallet_api_memory  = 512
wallet_api_port    = 7001

verifier_api_image  = "rubentewierik/verifier-api:x86"
verifier_api_cpu    = 256
verifier_api_memory = 512
verifier_api_port   = 7003

issuer_api_image  = "rubentewierik/issuer-api:x86"
issuer_api_cpu    = 256
issuer_api_memory = 512
issuer_api_port   = 7002

vault_image  = "rubentewierik/vault:x86"
vault_cpu    = 256
vault_memory = 512
vault_port   = 8200
