import { AuthenticationModule } from "../authentication";
import { Module } from "@nestjs/common";
import { UserModule } from "@/user/user.module";
import { SsiModule } from "@/ssi/app/ssi.module";
import { IssuersController } from "./issuers.controller";

@Module({
  imports: [AuthenticationModule, UserModule, SsiModule],
  providers: [],
  controllers: [IssuersController],
  exports: []
})
export class IssuersModule {}
