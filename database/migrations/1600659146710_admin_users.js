'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class AdminUsersSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('admin_users', (table) => {
    			table.increments('id').unsigned();
					table.string('first_name', 255).nullable();
					table.string('last_name', 255).nullable();
					table.string('email', 255);
					table.string('password', 255);
					table.string('remember_token', 100).nullable();
					table.integer('activated', 3).defaultTo('0');
					table.integer('forbidden', 3).defaultTo('0');
					table.string('language', 2).defaultTo('en');
					table.timestamp('deleted_at').nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('admin_users');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = AdminUsersSchema
