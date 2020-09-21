'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class EnrolleeTypeSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('enrollee_type', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 50);
					table.specificType('created_at', 'datetime').defaultTo(Database.fn.now());
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('enrollee_type');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = EnrolleeTypeSchema