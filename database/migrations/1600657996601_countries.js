'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class CountriesSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('countries', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 190).unique().nullable();
					table.string('iso3', 5).unique().nullable();
					table.string('iso2', 5).unique().nullable();
					table.string('phone_code', 255).nullable();
					table.string('capital', 255).nullable();
					table.string('currency', 10).nullable();
					table.string('native', 255).nullable();
					table.string('emoji', 255).nullable();
					table.string('emojiU', 255).nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('countries');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = CountriesSchema
