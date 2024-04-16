FROM waltid/wallet-api:1.0.2404100818-SNAPSHOT

COPY packages/backend/wallet-api/prod/config /waltid-wallet-api/config
COPY packages/backend/wallet-api/prod/walt.yaml /waltid-wallet-api/walt.yaml
