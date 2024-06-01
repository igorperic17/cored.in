import { User } from "@/user/user.entity";
import { PostVisibility } from "@coredin/shared";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  creatorWallet: string;

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
  @Index()
  replyToPostId: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "creatorWallet", referencedColumnName: "wallet" })
  user: User;

  @ManyToOne(() => Post, (post) => post.replies, {
    nullable: true,
    createForeignKeyConstraints: false
  })
  @JoinColumn({ name: "replyToPostId" })
  parent: Post;

  @OneToMany(() => Post, (post) => post.parent)
  @JoinColumn({ name: "replyToPostId" })
  replies: Post[];
}
