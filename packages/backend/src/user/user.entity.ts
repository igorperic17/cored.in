import { Post } from "@/posts/post.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany
} from "typeorm";

@Entity("users")
export class User {
  constructor(id: number, wallet: string, lastSeen: Date) {
    this.id = id;
    this.wallet = wallet;
    this.lastSeen = lastSeen;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
  wallet: string;

  @Column({
    type: "varchar",
    length: 99,
    nullable: true
  })
  username: string;

  @Column()
  lastSeen: Date;

  @Column("int", { array: true, default: {} })
  likedPosts: number[];

  @Column({
    nullable: true
  })
  avatarUrl: string;

  @Column({
    nullable: true
  })
  backgroundColor: string;

  @Column({
    nullable: true
  })
  avatarFallbackColor: string;

  @Column({
    type: "varchar",
    length: 250,
    nullable: true
  })
  bio: string;

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];
}
