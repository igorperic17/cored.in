import { User } from "@/user/user.entity";
import { PostVisibility } from "@coredin/shared";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne
} from "typeorm";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  createdAt: Date;

  @Column({
    type: "enum",
    enum: PostVisibility
  })
  @Index()
  visibility: PostVisibility;

  @Column({ default: 0 })
  likes: number;

  @Column({ nullable: true })
  replyToPostId: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
