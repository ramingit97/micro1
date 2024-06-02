import { MigrationInterface, QueryRunner } from "typeorm";

export class Orders1715449903732 implements MigrationInterface {
    name = 'Orders1715449903732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "userId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "userId"`);
    }

}
