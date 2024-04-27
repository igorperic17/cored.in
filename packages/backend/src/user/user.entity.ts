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

  @Index({ unique: true }) // https://orkhan.gitbook.io/typeorm/docs/indices
  @Column({ unique: true })
  wallet: string;

  @Column()
  lastSeen: Date;

  @Column("jsonb", { nullable: true })
  profile: UserProfile | null; // CarProperties | BookProperties; https://wanago.io/2020/12/28/nestjs-json-postgresql-typeorm/
}
