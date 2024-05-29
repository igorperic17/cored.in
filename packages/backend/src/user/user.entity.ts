import { Post } from "@/posts/post.entity";
import { UserProfile } from "@coredin/shared";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany
} from "typeorm";

@Entity("users")
export class User {
  constructor(
    id: number,
    wallet: string,
    lastSeen: Date,
    profile: UserProfile | null
  ) {
    this.id = id;
    this.wallet = wallet;
    this.lastSeen = lastSeen;
    this.profile = profile;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
  wallet: string;

  @Column()
  lastSeen: Date;

  @Column("jsonb", { nullable: true })
  profile: UserProfile | null;

  @Column("int", { array: true, default: {} })
  likedTweets: number[];

  @Column({
    nullable: true,
    default: "https://testcdn/somehting.jpg"
  })
  avatar: string;

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];
}
