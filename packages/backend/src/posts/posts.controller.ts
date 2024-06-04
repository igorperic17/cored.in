import { Controller, Delete, Get, Param, Req, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { AuthenticatedRequest } from "../authentication";
import { LoggedIn } from "../authentication/guard";
import { TypedBody, TypedParam, TypedRoute } from "@nestia/core";
import { CreatePostDTO } from "@coredin/shared";

@Controller("posts")
@UseGuards(LoggedIn)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPublic() {
    return this.postsService.getPublic();
  }

  @Get(":id")
  async getPost(@TypedParam("id") id: number) {
    return this.postsService.get(id);
  }

  @Get("user/:owner")
  async getOwn(
    @Param("owner") owner: string,
    @Req() req: AuthenticatedRequest
  ) {
    // TODO - check for valid profile subscription
    if (owner === req.wallet) {
      return this.postsService.getAllUserPosts(req.wallet);
    }

    return this.postsService.getPublicUserPosts(owner);
  }

  @TypedRoute.Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @TypedBody() createPostDTO: CreatePostDTO
  ) {
    // TODO - handle relevant return type and potential errors
    return await this.postsService.create(req.wallet, createPostDTO);
  }

  @Delete(":id")
  async delete(@TypedParam("id") id: number, @Req() req: AuthenticatedRequest) {
    // TODO - handle relevant return type and potential errors
    return await this.postsService.delete(req.wallet, id);
  }

  @TypedRoute.Post(":id/like")
  async like(
    @TypedParam("id") id: number,
    @Req() req: AuthenticatedRequest,
    @TypedBody() { liked }: { liked: boolean }
  ) {
    // TODO - handle relevant return type and potential errors
    return await this.postsService.updateLikedPost(req.wallet, id, liked);
  }
}
