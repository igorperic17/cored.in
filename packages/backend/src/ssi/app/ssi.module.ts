import { Module } from "@nestjs/common";
import { WaltIdWalletService } from "@/ssi/core/services";
import { ConfigModule } from "@nestjs/config";
import { WaltIdWalletServiceProvider } from "./providers";

@Module({
  imports: [ConfigModule],
  providers: [WaltIdWalletServiceProvider],
  exports: [WaltIdWalletService]
})
export class SsiModule {}
