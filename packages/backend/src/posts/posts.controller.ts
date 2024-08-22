import { Controller, Delete, Get, Param, Req, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { AuthenticatedRequest } from "../authentication";
import { LoggedIn } from "../authentication/guard";
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { CreatePostDTO } from "@coredin/shared";

@Controller("posts")
@UseGuards(LoggedIn)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPublicFeed() {
    return this.postsService.getPublicFeed();
  }

  @Get(":id")
  async getPost(
    @Req() req: AuthenticatedRequest,
    @TypedParam("id") id: number,
    @TypedQuery() params: { creator: string }
  ) {
    return this.postsService.get(id, params.creator, req.wallet);
  }

  @Get("user/:owner")
  async getOwn(
    @Param("owner") owner: string,
    @Req() req: AuthenticatedRequest
  ) {
    return this.postsService.getUserPosts(owner, req.wallet);
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
