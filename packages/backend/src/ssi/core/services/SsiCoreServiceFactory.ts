import { ConfigService } from "@nestjs/config";
import { WaltIdWalletService } from "./WaltIdWalletService";

export const SsiCoreServiceFactory = {
  provide: WaltIdWalletService,
  useFactory: (config: ConfigService) => {
    const walletApiUrl = config.get("wallet.api.url");
    return new WaltIdWalletService(walletApiUrl);
  },
  inject: [ConfigService]
};
