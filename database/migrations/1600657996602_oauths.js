'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class OauthsSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('oauths', (table) => {
    			table.increments('id').unsigned();
					table.string('unique_id', 190).unique().nullable();
					table.integer('user_id').references('id').inTable('users').unsigned().nullable();
					table.enum('provider', ['facebook','twitter','google']).nullable();
					table.timestamp('created_at').defaultTo(Database.fn.now());
					table.timestamp('updated_at').defaultTo(Database.fn.now());
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('oauths');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = OauthsSchema
