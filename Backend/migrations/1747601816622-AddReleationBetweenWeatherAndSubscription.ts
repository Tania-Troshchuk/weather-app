import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReleationBetweenWeatherAndSubscription1747601816622 implements MigrationInterface {
    name = 'AddReleationBetweenWeatherAndSubscription1747601816622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" ADD "weatherId" integer`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "UQ_01b7c0f1b14989d6666143128d3" UNIQUE ("weatherId")`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_01b7c0f1b14989d6666143128d3" FOREIGN KEY ("weatherId") REFERENCES "weather"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_01b7c0f1b14989d6666143128d3"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "UQ_01b7c0f1b14989d6666143128d3"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "weatherId"`);
    }

}
