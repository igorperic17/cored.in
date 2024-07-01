#!/bin/bash

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

echo "Starting vault, checking for volumes..."
echo "Checking for config..."
echo | ls -lh /vault/config
echo "Checking for data..."
echo | ls -lh /vault/data || echo "No data directory"

VAULT_STATUS_OUTPUT=$(bao status -format=json)
echo $VAULT_STATUS_OUTPUT

initialized=$(echo "$VAULT_STATUS_OUTPUT" | jq -r ".initialized")
echo "initialized" $initialized

if [ "$initialized" = false ] ; then
    echo "Initialising vault..."
    VAULT_INIT_OUTPUT=$(bao operator init -format=json)
    SECRET_NAME_PREFIX="coredin-vault/"

    # echo "$VAULT_INIT_OUTPUT"

    echo "Enabling transit..."
    initial_root_token=$(echo "$VAULT_INIT_OUTPUT" | jq -r ".root_token")
    bao login "$initial_root_token"
    bao secrets enable transit

    echo "Vault server successfully initialised. Writing secrets to AWS..."

    update_secret "root-token" "$initial_root_token"
fi

echo "Vault setup complete."