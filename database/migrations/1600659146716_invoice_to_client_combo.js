'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class InvoiceToClientComboSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('invoice_to_client_combo', (table) => {
    			table.increments('id').unsigned();
					table.integer('invoice_id').references('id').inTable('old_invoice').unsigned();
					table.integer('client_to_combo_id').references('id').inTable('client_to_combo').unsigned();
					table.integer('number_of_enrollees').unsigned().defaultTo('0');
					table.specificType('created_at', 'datetime').defaultTo(Database.fn.now());
					table.specificType('updated_at', 'datetime').defaultTo(Database.fn.now());
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('invoice_to_client_combo');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = InvoiceToClientComboSchema
