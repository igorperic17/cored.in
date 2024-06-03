import { ConfigService } from "@nestjs/config";
import { WaltIdIssuerService } from "@/ssi/core/services";

export const WaltIdIssuerServiceProvider = {
  provide: WaltIdIssuerService,
  useFactory: (config: ConfigService) => {
    const issuerApiUrl = config.get("issuer.api.url");
    return new WaltIdIssuerService(issuerApiUrl);
  },
  inject: [ConfigService]
};
