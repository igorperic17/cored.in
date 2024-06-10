import { ConfigService } from "@nestjs/config";
import { WaltIdWalletService } from "@/ssi/core/services";
import { SecretsService } from "@/secrets/SecretsService";

export const WaltIdWalletServiceProvider = {
  provide: WaltIdWalletService,
  useFactory: (config: ConfigService, secrets: SecretsService) => {
    const walletApiUrl = config.get("wallet.api.url");
    const vaultApiUrl = config.get("vault.api.url");
    const vaultAccessKey = secrets.get("vault_access_key");
    return new WaltIdWalletService(walletApiUrl, vaultApiUrl, vaultAccessKey);
  },
  inject: [ConfigService, SecretsService]
};
