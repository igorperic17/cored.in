FROM openbao/openbao:2.0.0-beta20240618-amd64

RUN apk update && \
    apk add --no-cache \
        python3 \
        py3-pip

RUN pip install awscli --upgrade --user

ENV PATH="/root/.local/bin:${PATH}"

RUN apk add --no-cache curl

RUN curl -sSL -o /usr/local/bin/jq "https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64" \
    && chmod +x /usr/local/bin/jq

EXPOSE 8200

ENV BAO_ADDR=http://0.0.0.0:8200

VOLUME /vault/data

COPY packages/backend/vault/prod/config /vault/config

COPY packages/backend/vault/initialise_vault.sh /vault/initialise_vault.sh

RUN chmod +x /vault/initialise_vault.sh

CMD ["sh", "-c", "chmod -R 777 /vault && bao server -config /vault/config/bao_config.json & /vault/initialise_vault.sh && wait"]
