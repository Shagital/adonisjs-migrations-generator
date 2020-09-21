'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ThirdPartyToUserSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('third_party_to_user', (table) => {
    			table.increments('id').unsigned();
					table.integer('third_party_id').references('id').inTable('third_party_app').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.enum('type', ['1','2']).defaultTo('1');
					table.integer('created_by').references('id').inTable('user').unsigned();
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
    this.dropIfExists('third_party_to_user');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ThirdPartyToUserSchema
