import { AuthenticationModule } from "../authentication";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsController } from "./posts.controller";
import { Post } from "./post.entity";
import { PostsService } from "./posts.service";

@Module({
  imports: [AuthenticationModule, TypeOrmModule.forFeature([Post])],
  providers: [PostsService],
  controllers: [PostsController],
  exports: []
})
export class PostsModule {}
