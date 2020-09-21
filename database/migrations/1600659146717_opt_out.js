'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class OptOutSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('opt_out', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.enum('notification_type', ['1']);
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('opt_out');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = OptOutSchema
