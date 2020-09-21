'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class UserSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('user', (table) => {
    			table.increments('id').unsigned();
					table.string('first_name', 50);
					table.string('last_name', 50);
					table.string('phone_number', 15).nullable();
					table.string('email_address', 100).unique();
					table.string('duplicate_email_address', 100).nullable();
					table.string('password', 100);
					table.string('access_token', 100).unique();
					table.string('referral_code', 50).unique();
					table.decimal('wallet_balance', 15, 2).defaultTo('0.00');
					table.integer('created_by').unsigned();
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
    this.dropIfExists('user');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = UserSchema
