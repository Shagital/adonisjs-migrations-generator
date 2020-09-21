'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class TranslationsSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('translations', (table) => {
    			table.increments('id').unsigned();
					table.string('namespace', 255).defaultTo('*');
					table.string('group', 255);
					table.text('key');
					table.specificType('text', 'json');
					table.specificType('metadata', 'json').nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.timestamp('deleted_at').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('translations');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = TranslationsSchema
