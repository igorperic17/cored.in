import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthenticatedRequest } from "../authentication";
import { LoggedIn } from "../authentication/guard";
// import { UserProfile } from "@coredin/shared";
// import { TypedBody, TypedRoute } from "@nestia/core";
import { Effect } from "effect";
import { TypedBody, TypedRoute } from "@nestia/core";
import { UpdateProfileDTO } from "@coredin/shared";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(LoggedIn)
  async getProfile(@Req() req: AuthenticatedRequest) {
    console.log("User requested: ", req.wallet);
    await this.userService.updateLastSeen(req.wallet);
    const user = await Effect.runPromise(
      await this.userService.get(req.wallet)
    );

    return user;
  }

  @TypedRoute.Post()
  @UseGuards(LoggedIn)
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @TypedBody() profile: UpdateProfileDTO
  ) {
    const res = await this.userService.updateProfile(req.wallet, profile);

    return res.affected === 1;
  }
}
