import { AuthenticationModule } from "../authentication";
import { UserController } from "./user.controller";
import { Module } from "@nestjs/common";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { SsiModule } from "../ssi/app/ssi.module";
import { CoreumModule } from "@/coreum/app/coreum.module";

@Module({
  imports: [
    AuthenticationModule,
    SsiModule,
    TypeOrmModule.forFeature([User]),
    CoreumModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
