import { Global, Module } from "@nestjs/common";
import { SsiCoreServiceFactory, WaltIdWalletService } from "./core/services";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
	imports: [ConfigModule],
	providers: [SsiCoreServiceFactory],
	exports: [WaltIdWalletService]
})
export class SsiModule {}
