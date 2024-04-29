import { ConfigService } from "@nestjs/config";
import { WaltIdWalletService } from "@/ssi/core/services";

export const WaltIdWalletServiceProvider = {
  provide: WaltIdWalletService,
  useFactory: (config: ConfigService) => {
    const walletApiUrl = config.get("wallet.api.url");
    return new WaltIdWalletService(walletApiUrl);
  },
  inject: [ConfigService]
};
