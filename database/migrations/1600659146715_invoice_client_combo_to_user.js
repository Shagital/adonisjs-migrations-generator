'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class InvoiceClientComboToUserSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('invoice_client_combo_to_user', (table) => {
    			table.increments('id').unsigned();
					table.integer('invoice_to_client_combo_id').references('id').inTable('invoice_to_client_combo').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('month_access').unsigned().defaultTo('0');
					table.integer('managed_by').references('id').inTable('user').unsigned().nullable();
					table.integer('transfer_flag', 3).defaultTo('0');
					table.integer('new_plan_id').unsigned().nullable();
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
    this.dropIfExists('invoice_client_combo_to_user');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = InvoiceClientComboToUserSchema
