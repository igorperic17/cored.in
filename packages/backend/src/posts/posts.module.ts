import { AuthenticationModule } from "../authentication";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsController } from "./posts.controller";
import { Post } from "./post.entity";
import { PostsService } from "./posts.service";
import { CoreumModule } from "@/coreum/app/coreum.module";

@Module({
  imports: [
    AuthenticationModule,
    CoreumModule,
    TypeOrmModule.forFeature([Post])
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: []
})
export class PostsModule {}
