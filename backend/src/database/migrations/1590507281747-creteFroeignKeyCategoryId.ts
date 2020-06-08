/* eslint-disable @typescript-eslint/class-name-casing */
import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class creteFroeignKeyCategoryId1590507281747
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'categoryId',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'categoryId');
  }
}
