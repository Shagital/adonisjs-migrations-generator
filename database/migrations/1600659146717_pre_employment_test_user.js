'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class PreEmploymentTestUserSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('pre_employment_test_user', (table) => {
    			table.increments('id').unsigned();
					table.integer('pre_employment_test_id').references('id').inTable('pre_employment_test').unsigned();
					table.string('first_name', 50);
					table.string('last_name', 50);
					table.specificType('encountered_at', 'date').nullable();
					table.decimal('price', 15, 2).defaultTo('0.00');
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
    this.dropIfExists('pre_employment_test_user');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = PreEmploymentTestUserSchema
