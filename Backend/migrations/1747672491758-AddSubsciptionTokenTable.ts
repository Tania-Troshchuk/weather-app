import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubsciptionTokenTable1747672491758 implements MigrationInterface {
    name = 'AddSubsciptionTokenTable1747672491758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscription_token_type_enum" AS ENUM('confirm', 'unsubscribe')`);
        await queryRunner.query(`CREATE TABLE "subscription_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "type" "public"."subscription_token_type_enum" NOT NULL, "subscriptionId" integer, CONSTRAINT "PK_c0c0456595128479e0a6bfe0579" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscription_token" ADD CONSTRAINT "FK_9016f45dd8e708b429f9931b94f" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_token" DROP CONSTRAINT "FK_9016f45dd8e708b429f9931b94f"`);
        await queryRunner.query(`DROP TABLE "subscription_token"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_token_type_enum"`);
    }

}
