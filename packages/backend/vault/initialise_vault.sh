#!/bin/sh

update_secret() {
    local secret_name="$1"
    local secret_value="$2"

    aws secretsmanager get-secret-value --region "$AWS_REGION" --secret-id "$SECRET_NAME_PREFIX$secret_name" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        aws secretsmanager put-secret-value \
            --region "$AWS_REGION" \
            --secret-id "$SECRET_NAME_PREFIX$secret_name" \
            --secret-string "$secret_value"
        echo "Updated $SECRET_NAME_PREFIX$secret_name in AWS Secrets Manager"
    else
        echo "Secret $SECRET_NAME_PREFIX$secret_name not found in AWS Secrets Manager!"
        exit 1
    fi
}

sleep 10

VAULT_INIT_OUTPUT=$(bao operator init -format=json)
AWS_REGION="eu-west-1"
SECRET_NAME_PREFIX="coredin-vault/"
NUMBERS="1 2 3 4 5"

echo $VAULT_INIT_OUTPUT

echo "Unsealing vault..."
for i in $NUMBERS; do
  index=$(expr $i - 1)
  unseal_key=$(echo "$VAULT_INIT_OUTPUT" | jq -r ".unseal_keys_b64[$index]")
  bao operator unseal $unseal_key
done

echo "Enabling transit..."
initial_root_token=$(echo "$VAULT_INIT_OUTPUT" | jq -r ".root_token")
bao login $initial_root_token
bao secrets enable transit

echo "Vault server successfully initialised. Writing secrets to AWS..."

echo $(aws --version)

for i in $NUMBERS; do
  index=$(expr $i - 1)
  unseal_key=$(echo "$VAULT_INIT_OUTPUT" | jq -r ".unseal_keys_b64[$index]")
  update_secret "unseal-key-$i" "$unseal_key"
done

update_secret "root-token" "$initial_root_token"

echo "Vault setup complete."