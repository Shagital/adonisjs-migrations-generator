'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class UsersSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('users', (table) => {
    			table.increments('id').unsigned();
					table.string('username', 80).unique();
					table.string('first_name', 80).nullable();
					table.string('last_name', 80).nullable();
					table.string('email', 100).unique();
					table.string('password', 255);
					table.string('photo_url', 255).nullable();
					table.string('ip_address', 255).nullable();
					table.string('private_key', 255);
					table.string('public_key', 255);
					table.integer('plan_id').nullable();
					table.timestamp('subscription_ends').nullable();
					table.text('meta').nullable();
					table.timestamp('deleted_at').nullable();
					table.timestamp('created_at').defaultTo(Database.fn.now());
					table.timestamp('updated_at').defaultTo(Database.fn.now());
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('users');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = UsersSchema
