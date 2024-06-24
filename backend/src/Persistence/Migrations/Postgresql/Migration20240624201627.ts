import { Migration } from '@mikro-orm/migrations';

export class Migration20240624201627 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "farcaster_id" int not null, "wallet_address" varchar(255) not null, "eneregy" real not null default 0, "accumulated_energy" real not null default 0, "experience" real not null default 0, "level" int not null default 1);');
    this.addSql('alter table "user" add constraint "user_farcaster_id_unique" unique ("farcaster_id");');
    this.addSql('alter table "user" add constraint "user_wallet_address_unique" unique ("wallet_address");');

    this.addSql('create table "refresh_token" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "token" text not null, "jti" varchar(255) not null, "expiration_date" timestamptz(0) not null, "user_id" int not null);');

    this.addSql('create table "pet" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "token_id" int not null, "user_id" int not null);');
    this.addSql('alter table "pet" add constraint "pet_token_id_unique" unique ("token_id");');
    this.addSql('alter table "pet" add constraint "pet_user_id_unique" unique ("user_id");');

    this.addSql('alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "pet" add constraint "pet_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "refresh_token" drop constraint "refresh_token_user_id_foreign";');

    this.addSql('alter table "pet" drop constraint "pet_user_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "refresh_token" cascade;');

    this.addSql('drop table if exists "pet" cascade;');
  }

}
