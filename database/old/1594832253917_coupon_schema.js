'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class CouponSchema extends Schema {
  up () {
    this.create('coupons', (table) => {
      table.increments();
      table.decimal('percent', 4, 2);
      table.string('reference', 190);
      table.timestamp('expires_on');
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('coupons')
  }
}

module.exports = CouponSchema
