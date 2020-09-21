'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class InvoiceClientComboToExtensionSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('invoice_client_combo_to_extension', (table) => {
    			table.increments('id').unsigned();
					table.integer('invoice_to_client_combo_id').references('id').inTable('invoice_to_client_combo').unsigned();
					table.integer('extension_id').references('id').inTable('extension').unsigned();
					table.integer('provider_id').references('id').inTable('provider').unsigned().nullable();
					table.integer('user_id').references('id').inTable('user').unsigned().nullable();
					table.decimal('price', 15, 2).defaultTo('0.00');
					table.integer('month_access').unsigned().defaultTo('0');
					table.integer('has_anc', 3).defaultTo('0');
					table.text('metadata').nullable();
					table.specificType('created_at', 'datetime').defaultTo(Database.fn.now());
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('invoice_client_combo_to_extension');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = InvoiceClientComboToExtensionSchema
