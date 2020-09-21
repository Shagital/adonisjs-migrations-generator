'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ClientToComboSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('client_to_combo', (table) => {
    			table.increments('id').unsigned();
					table.integer('client_id').references('id').inTable('client').unsigned().nullable();
					table.integer('hmo_combo_id').references('id').inTable('hmo_combo').unsigned();
					table.decimal('price', 15, 2);
					table.decimal('quarterly_price', 15, 2).nullable();
					table.decimal('yearly_price', 15, 2).nullable();
					table.string('alias', 191);
					table.integer('is_retail_exempt', 3).defaultTo('0');
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
    this.dropIfExists('client_to_combo');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ClientToComboSchema
