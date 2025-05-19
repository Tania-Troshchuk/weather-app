import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1747683008566 implements MigrationInterface {
    name = 'CreateTables1747683008566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscription_frequency_enum" AS ENUM('hourly', 'daily')`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "city" character varying NOT NULL, "frequency" "public"."subscription_frequency_enum" NOT NULL, "confirmed" boolean DEFAULT false, "weatherId" integer, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "weather" ("id" SERIAL NOT NULL, "temperature" double precision, "humidity" double precision, "description" character varying, CONSTRAINT "PK_af9937471586e6798a5e4865f2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."subscription_token_type_enum" AS ENUM('confirm', 'unsubscribe')`);
        await queryRunner.query(`CREATE TABLE "subscription_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "type" "public"."subscription_token_type_enum" NOT NULL, "subscriptionId" integer, CONSTRAINT "PK_c0c0456595128479e0a6bfe0579" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_01b7c0f1b14989d6666143128d3" FOREIGN KEY ("weatherId") REFERENCES "weather"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_token" ADD CONSTRAINT "FK_9016f45dd8e708b429f9931b94f" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_token" DROP CONSTRAINT "FK_9016f45dd8e708b429f9931b94f"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_01b7c0f1b14989d6666143128d3"`);
        await queryRunner.query(`DROP TABLE "subscription_token"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_token_type_enum"`);
        await queryRunner.query(`DROP TABLE "weather"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_frequency_enum"`);
    }

}
