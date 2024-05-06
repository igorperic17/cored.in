import { UserProfile } from "@coredin/shared";
import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

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
}
