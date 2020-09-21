'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class PaymentsSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('payments', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('users').unsigned().nullable();
					table.integer('plan_id').references('id').inTable('plans').unsigned().nullable();
					table.integer('coupon_id').references('id').inTable('coupons').unsigned().nullable();
					table.decimal('amount', 10, 2).nullable();
					table.string('currency', 10).nullable();
					table.string('txn_ref', 80).unique().nullable();
					table.string('reference', 80).unique().nullable();
					table.string('payment_ref', 80).unique().nullable();
					table.timestamp('created_at').defaultTo(Database.fn.now());
					table.timestamp('updated_at').defaultTo(Database.fn.now());
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('payments');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = PaymentsSchema
