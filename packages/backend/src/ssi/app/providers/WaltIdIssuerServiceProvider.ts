import { ConfigService } from "@nestjs/config";
import { WaltIdIssuerService } from "@/ssi/core/services";
import { SecretsService } from "@/secrets/SecretsService";

export const WaltIdIssuerServiceProvider = {
  provide: WaltIdIssuerService,
  useFactory: (config: ConfigService, secrets: SecretsService) => {
    const issuerApiUrl = config.get("issuer.api.url");
    const vaultApiUrl = config.get("vault.api.url");
    const vaultAccessKey = secrets.get("vault_access_key");
    return new WaltIdIssuerService(issuerApiUrl, vaultApiUrl, vaultAccessKey);
  },
  inject: [ConfigService, SecretsService]
};
