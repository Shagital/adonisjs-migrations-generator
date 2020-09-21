'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class OldInvoiceSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('old_invoice', (table) => {
    			table.increments('id').unsigned();
					table.integer('parent_invoice_id').references('id').inTable('old_invoice').unsigned().nullable();
					table.integer('plan_invoice_id').references('id').inTable('old_invoice').unsigned().nullable();
					table.decimal('total_price', 15, 2);
					table.string('reference_code', 191).unique();
					table.integer('payment_status_id').references('id').inTable('payment_status').unsigned();
					table.integer('payment_frequency_id').references('id').inTable('time_frame').unsigned();
					table.integer('new_payment_frequency_id').unsigned().nullable();
					table.integer('version', 3).nullable();
					table.string('comment', 191).defaultTo('No Comment');
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.integer('created_for').references('id').inTable('user').unsigned().nullable();
					table.integer('is_subscribed', 3);
					table.integer('discount_id').references('id').inTable('discount').unsigned().nullable();
					table.text('metadata').nullable();
					table.specificType('start_date', 'date');
					table.specificType('end_date', 'date').nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('old_invoice');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = OldInvoiceSchema
