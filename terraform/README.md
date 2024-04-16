## Deploying to production

Execute the command

```tf
terraform apply -var-file=prod.tfvars
```

### Registering a CNAME record for the API

Since the domain is controlled externally and we are attaching an existing ACM certificate as custom domain name to the API gateway, the CNAME record to link the domain name to the CloudFront distribution created for the API gateway's custom domain name needs to be done manually after deployment of the Terraform project.

## Removing all production infrastructure

Execute the command

```tf
terraform destroy -var-file=prod.tfvars
```

### Destroying remaining AWS Secrets Manager secret when cleaning up all infrastructure including secrets required for RDS backup restore

```
aws secretsmanager delete-secret --secret-id {APP_NAME}-rds-password --force-delete-without-recovery
```
