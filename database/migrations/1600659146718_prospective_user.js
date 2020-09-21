'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ProspectiveUserSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('prospective_user', (table) => {
    			table.increments('id').unsigned();
					table.string('first_name', 50);
					table.string('last_name', 50);
					table.string('phone_number', 15).nullable();
					table.string('email_address', 100).nullable();
					table.integer('state_id').references('id').inTable('state').unsigned();
					table.enum('prospect_type', ['1','2']).defaultTo('1');
					table.text('note').nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('prospective_user');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ProspectiveUserSchema
