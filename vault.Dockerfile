FROM openbao/openbao:2.0.0-alpha20240329

EXPOSE 8200

ENV BAO_ADDR=http://0.0.0.0:8200

VOLUME /vault/data

COPY packages/backend/vault/prod/config /vault/config

COPY packages/backend/vault/initialise_vault.sh /vault/initialise_vault.sh

RUN chmod +x /vault/initialise_vault.sh

CMD ["sh", "-c", "/vault/initialise_vault.sh"]
