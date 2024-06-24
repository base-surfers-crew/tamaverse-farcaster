import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

@Entity()
export class Pet extends BaseEntity {
  @Property({ unique: true })
  public TokenId: number;

  @OneToOne(() => User)
  public User: User;

  constructor(
    tokenId: number,
    owner: User
  ) {
    super();

    this.TokenId = tokenId;
    this.User = owner;
  }
}