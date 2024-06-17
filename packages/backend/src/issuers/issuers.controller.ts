import { Controller, Get, UseGuards } from "@nestjs/common";
import { LoggedIn } from "../authentication/guard";
import { UserService } from "@/user/user.service";

@Controller("issuers")
@UseGuards(LoggedIn)
export class IssuersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getIssuers();
  }
}
