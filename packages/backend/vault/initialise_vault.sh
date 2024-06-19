#!/bin/sh

install_aws_cli() {
    if ! command -v aws &> /dev/null; then
        echo "AWS CLI not found. Installing AWS CLI..."
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        ./aws/install
        rm -rf aws awscliv2.zip
        echo "AWS CLI installed successfully."
    else
        echo "AWS CLI already installed."
    fi
}

update_secret() {
    local secret_name="$1"
    local secret_value="$2"

    aws secretsmanager get-secret-value --region "$AWS_REGION" --secret-id "$SECRET_NAME_PREFIX$secret_name" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        aws secretsmanager put-secret-value \
            --region "$AWS_REGION" \
            --secret-id "$SECRET_NAME_PREFIX$secret_name" \
            --secret-string "$secret_value"
        echo "Updated $secret_name in AWS Secrets Manager"
    else
        echo "Secret $secret_name not found in AWS Secrets Manager!"
        exit 1
    fi
}

sleep 10

VAULT_INIT_OUTPUT=$(bao operator init -format=json)
AWS_REGION="eu-west-1"
SECRET_NAME_PREFIX="coredin-vault/"
NUMBERS="1 2 3 4 5"

echo "Unsealing vault..."
for i in $NUMBERS; do
  index=$(expr $i - 1)
  recovery_key=$(echo "$VAULT_INIT_OUTPUT" | jq -r ".recovery_keys_b64[$index]")
  bao unseal $recovery_key
done

echo "Enabling transit..."
initial_root_token=$(echo "$VAULT_INIT_OUTPUT" | jq -r ".root_token")
bao login $initial_root_token
bao secrets enable transit

echo "Vault server successfully initialised. Writing secrets to AWS..."

install_aws_cli

for i in $NUMBERS; do
  index=$(expr $i - 1)
  recovery_key=$(echo "$VAULT_INIT_OUTPUT" | jq -r ".recovery_keys_b64[$index]")
  update_secret "recovery-key-$i" "$recovery_key"
done

update_secret "root-token" "$initial_root_token"

echo "Vault setup complete."