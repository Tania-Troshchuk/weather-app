import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWeatherAndSubscriptionTables1747576062387 implements MigrationInterface {
    name = 'CreateWeatherAndSubscriptionTables1747576062387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "weather" ("id" SERIAL NOT NULL, "temperature" double precision, "humidity" double precision, "description" character varying, CONSTRAINT "PK_af9937471586e6798a5e4865f2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."subscription_frequency_enum" AS ENUM('hourly', 'daily')`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "city" character varying NOT NULL, "frequency" "public"."subscription_frequency_enum" NOT NULL, "confirmed" boolean DEFAULT false, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_frequency_enum"`);
        await queryRunner.query(`DROP TABLE "weather"`);
    }

}
