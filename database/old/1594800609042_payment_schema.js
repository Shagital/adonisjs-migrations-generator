'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class PaymentSchema extends Schema {
  up () {
    this.create('payments', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('plan_id').unsigned().references('id').inTable('plans');
      table.integer('coupon_id').nullable().unsigned().references('id').inTable('coupons');
      table.decimal('amount', 10, 2)
      table.string('currency', 10)
      table.string('txn_ref', 80).unique();
      table.string('reference', 80).unique();
      table.string('payment_ref', 80).unique();
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('payments')
  }
}

module.exports = PaymentSchema
