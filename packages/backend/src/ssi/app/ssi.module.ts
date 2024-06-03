import { Module } from "@nestjs/common";
import { WaltIdWalletService } from "@/ssi/core/services";
import { ConfigModule } from "@nestjs/config";
import {
  WaltIdIssuerServiceProvider,
  WaltIdWalletServiceProvider
} from "./providers";

@Module({
  imports: [ConfigModule],
  providers: [WaltIdWalletServiceProvider, WaltIdIssuerServiceProvider],
  exports: [WaltIdWalletService]
})
export class SsiModule {}
