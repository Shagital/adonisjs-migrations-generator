'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class OldPaymentSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('old_payment', (table) => {
    			table.increments('id').unsigned();
					table.integer('invoice_id').references('id').inTable('old_invoice').unsigned();
					table.decimal('amount', 15, 2);
					table.string('comment', 191);
					table.string('access_code', 191).nullable();
					table.string('transaction_reference', 191).nullable();
					table.string('transfer_code', 191).nullable();
					table.integer('payment_status_id').references('id').inTable('payment_status').unsigned();
					table.specificType('start_date', 'date').nullable();
					table.specificType('end_date', 'date').nullable();
					table.integer('created_by').references('id').inTable('user').unsigned().nullable();
					table.specificType('created_at', 'datetime');
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('old_payment');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = OldPaymentSchema
