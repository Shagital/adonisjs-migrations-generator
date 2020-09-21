'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class InvoiceSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('invoice', (table) => {
    			table.increments('id').unsigned();
					table.integer('parent_id').references('id').inTable('invoice').unsigned().nullable();
					table.integer('previous_id').references('id').inTable('invoice').unsigned().nullable();
					table.string('reference_code', 191).unique();
					table.enum('invoice_type', ['1','2']).defaultTo('1');
					table.decimal('price', 15, 2);
					table.integer('payment_status_id').references('id').inTable('payment_status').unsigned();
					table.integer('client_id').references('id').inTable('client').unsigned().nullable();
					table.integer('discount_id').references('id').inTable('discount').unsigned().nullable();
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.text('metadata').nullable();
					table.integer('version', 3).unsigned().nullable();
					table.text('description').nullable();
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
    this.dropIfExists('invoice');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = InvoiceSchema
