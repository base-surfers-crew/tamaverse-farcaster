import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { AutoMap } from '@automapper/classes';
import { BaseEntity } from './BaseEntity';
import { RefreshToken } from './RefreshToken';
import { Pet } from './Pet';

@Entity()
export class User extends BaseEntity {
  @Property({ unique: true})
  @AutoMap()
  public FarcasterId: number;

  @Property({ unique: true })
  @AutoMap()
  public WalletAddress: string;

  @Property({ default: 0, type: "float" })
  @AutoMap()
  public Eneregy: number;

  @Property({ default: 0, type: "float" })
  @AutoMap()
  public AccumulatedEnergy: number;

  @Property({ default: 0, type: "float" })
  @AutoMap()
  public Experience: number;

  @Property({ default: 1 })
  @AutoMap()
  public Level: number;

  @OneToOne(() => Pet, (x) => x.User, { nullable: true, cascade: [Cascade.REMOVE] })
  @AutoMap()
  public Pet?: Pet;

  @OneToMany(() => RefreshToken, (rt) => rt.User, { cascade: [Cascade.REMOVE] })
  @AutoMap()
  public RefreshTokens = new Collection<RefreshToken>(this);
  
  constructor(
    fid: number,
    address: string,
  ) {
    super();

    this.FarcasterId = fid;
    this.WalletAddress = address;
    this.Eneregy = 0;
    this.AccumulatedEnergy = 0;
    this.Experience = 0;
    this.Level = 1;
  }
}
