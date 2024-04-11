import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthenticatedRequest } from "src/authentication";
import { LoggedIn } from "src/authentication/guard";
import { UserProfile } from "@coredin/shared";
import { TypedBody } from "@nestia/core";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(LoggedIn)
  async getProfile(
    @Req() req: AuthenticatedRequest
  ): Promise<{ profile: UserProfile }> {
    console.log("User requested: ", req.wallet);
    await this.userService.updateLastSeen(req.wallet);
    const user = await this.userService.get(req.wallet);
    console.log("got user ", user);

    // We've upserted the user to update last seen and the service populates profile with null values
    // so we can safely tell typescript that both user and profile will exist
    return { profile: user!.profile! };
  }

  @Post()
  @UseGuards(LoggedIn)
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @TypedBody() profile: UserProfile
  ) {
    const res = await this.userService.updateProfile(req.wallet, profile);

    return res.affected === 1;
  }
}
