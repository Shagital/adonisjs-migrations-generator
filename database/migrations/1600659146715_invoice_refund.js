'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class InvoiceRefundSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('invoice_refund', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('invoice_id').references('id').inTable('invoice').unsigned();
					table.string('reference_code', 50).unique();
					table.decimal('total_price', 15, 2).defaultTo('0.00');
					table.string('account_name', 50).nullable();
					table.string('account_number', 50).nullable();
					table.integer('bank_id').references('id').inTable('bank').unsigned().nullable();
					table.string('recipient_code', 50).nullable();
					table.string('comment', 191);
					table.integer('payment_state_id').references('id').inTable('payment_state').unsigned().defaultTo('1');
					table.text('metadata').nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('invoice_refund');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = InvoiceRefundSchema
