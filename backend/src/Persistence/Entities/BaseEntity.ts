import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey({ serializedPrimaryKey: true })
  public Id: number;

  @Property()
  public CreatedAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  public UpdatedAt: Date = new Date();
}
