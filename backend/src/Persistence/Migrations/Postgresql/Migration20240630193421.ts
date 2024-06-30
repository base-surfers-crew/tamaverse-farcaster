import { Migration } from '@mikro-orm/migrations';

export class Migration20240630193421 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "farcaster_id" int not null, "wallet_address" varchar(255) not null, "eneregy" real not null default 0, "accumulated_energy" real not null default 0, "experience" real not null default 0, "level" int not null default 1, "pet_id" int null);');
    this.addSql('alter table "user" add constraint "user_farcaster_id_unique" unique ("farcaster_id");');
    this.addSql('alter table "user" add constraint "user_wallet_address_unique" unique ("wallet_address");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
