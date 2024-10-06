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
  constructor(
    id: number,
    creatorWallet: string,
    text: string,
    createdAt: Date,
    visibility: PostVisibility,
    likes: number,
    replyToPostId: number,
    user: User,
    parent: Post,
    replies: Post[]
  ) {
    this.id = id;
    this.creatorWallet = creatorWallet;
    this.text = text;
    this.createdAt = createdAt;
    this.visibility = visibility;
    this.likes = likes;
    this.replyToPostId = replyToPostId;
    this.user = user;
    this.parent = parent;
    this.replies = replies;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  creatorWallet: string;

  @Column()
  text: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  lastReplyDate?: Date;

  @Column({
    type: "enum",
    enum: PostVisibility
  })
  @Index()
  visibility: PostVisibility;

  @Column("varchar", { array: true, default: [] })
  @Index()
  recipientWallets: string[];

  @Column("varchar", { array: true, default: [] })
  @Index()
  unreadByWallets: string[];

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  tips: number;

  @Column({ nullable: true })
  @Index()
  replyToPostId: number;

  @ManyToOne(() => User)
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
