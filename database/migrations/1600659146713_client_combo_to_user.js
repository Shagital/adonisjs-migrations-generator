'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ClientComboToUserSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('client_combo_to_user', (table) => {
    			table.increments('id').unsigned();
					table.integer('client_combo_id').references('id').inTable('client_to_combo').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned().unique();
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
    this.dropIfExists('client_combo_to_user');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ClientComboToUserSchema
