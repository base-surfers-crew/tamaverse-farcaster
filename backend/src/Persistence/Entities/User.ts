import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { AutoMap } from "@automapper/classes";

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

  @Property({ nullable: true })
  @AutoMap()
  public PetId?: number;
  
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
