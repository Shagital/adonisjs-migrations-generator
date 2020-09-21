'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class CitiesSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('cities', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 150).nullable();
					table.integer('country_id').unsigned().index().nullable();
					table.integer('state_id').references('id').inTable('regions').unsigned().index().nullable();
					table.string('country_code', 255).nullable();
					table.string('state_code', 255).nullable();
					table.decimal('latitude', 10, 8).nullable();
					table.decimal('longitude', 11, 8).nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('cities');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = CitiesSchema
