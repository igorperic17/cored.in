FROM openbao/openbao:2.0.0-alpha20240329

EXPOSE 8200

ENV BAO_ADDR=http://0.0.0.0:8200

VOLUME /vault/data

COPY packages/backend/vault/prod/config /vault/config

CMD ["sh", "-c", "chmod -R 777 /vault && bao server -config /vault/config/bao_config.json"]
