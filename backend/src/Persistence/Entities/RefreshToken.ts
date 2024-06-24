import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { User } from './User';

@Entity()
export class RefreshToken extends BaseEntity {
  @Property({ type: 'text' })
  public Token: string;

  @Property()
  public Jti: string;

  @Property()
  public ExpirationDate: Date;

  @ManyToOne(() => User)
  public User: User;

  constructor(owner: User, token: string, jti: string, expirationDate: Date) {
    super();

    this.Token = token;
    this.Jti = jti;
    this.ExpirationDate = expirationDate;
    this.User = owner;
  }
}
