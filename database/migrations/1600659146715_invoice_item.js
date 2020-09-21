'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class InvoiceItemSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('invoice_item', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 191);
					table.integer('invoice_id').references('id').inTable('invoice').unsigned();
					table.integer('product_id').references('id').inTable('product').unsigned();
					table.integer('quantity').defaultTo('1');
					table.decimal('unit_price', 15, 2);
					table.decimal('total_price', 15, 2);
					table.text('description').nullable();
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
    this.dropIfExists('invoice_item');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = InvoiceItemSchema
