import { AuthenticationModule } from "src/authentication";
import { UserController } from "./user.controller";
import { Module } from "@nestjs/common";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";

@Module({
  imports: [AuthenticationModule, TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
