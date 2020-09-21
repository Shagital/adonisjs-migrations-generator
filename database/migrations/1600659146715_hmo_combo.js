'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class HmoComboSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('hmo_combo', (table) => {
    			table.increments('id').unsigned();
					table.integer('hmo_package_id').references('id').inTable('hmo_package').unsigned();
					table.integer('hmo_plan_id').references('id').inTable('hmo_plan').unsigned();
					table.integer('hmo_plan_type_id').references('id').inTable('hmo_plan_type').unsigned();
					table.decimal('price', 15, 2);
					table.decimal('threshold_price', 15, 2);
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
    this.dropIfExists('hmo_combo');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = HmoComboSchema
