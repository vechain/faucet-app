variable "project" {
  default = "explore"
}

module "faucet-app-domains" {
  source                  = "git@github.com:vechain/terraform_infrastructure_modules.git//route53?ref=dont-require-vpc_id"
  public_zone_name        = "${local.env.environment}.${local.env.project}.vechain.org"
  domain_name             = "${local.env.project}.vechain.org"
  project                 = local.env.project
  env                     = local.env.environment
  public_zone_record_name = "${local.env.environment}.${local.env.project}"
  create_cert             = true
}

module "faucet-app-frontend" {
  source        = "git@github.com:vechain/terraform_infrastructure_modules.git//s3-cloudfront-hosting?ref=v.1.0.43"
  env           = local.env.environment
  origin_id     = "${module.faucet-app-domains.public_zone_name}_origin_id"
  bucket_prefix = "${local.env.environment}-${local.env.project}-faucet-app"
  domain_name   = module.faucet-app-domains.public_zone_name
  domain_zone   = module.faucet-app-domains.public_zone_id
  project       = local.env.project
}
