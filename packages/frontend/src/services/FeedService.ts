import { HttpService } from "@/services";
import { CreatePostDTO, PostDTO } from "@coredin/shared";

export class FeedService {
  constructor(private readonly http: HttpService) {}

  async getFeed(): Promise<PostDTO[]> {
    return this.http.get("posts");
  }

  async getUserFeed(user: string): Promise<PostDTO[]> {
    return this.http.get("posts/" + user);
  }

  async publish(createDTO: CreatePostDTO): Promise<void> {
    return this.http.post("posts", createDTO);
  }

  async likePost(postId: number, liked: boolean): Promise<void> {
    return this.http.post("posts/" + postId + `/like`, { liked });
  }
}
