'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ThirdPartyAppSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('third_party_app', (table) => {
    			table.increments('id').unsigned();
					table.string('account_name', 100);
					table.string('username', 100).unique();
					table.string('password', 100);
					table.string('callback_url', 191).nullable();
					table.string('webhook_url', 191).nullable();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('client_id').references('id').inTable('client').unsigned().nullable();
					table.string('monnify_account_number', 191).nullable();
					table.string('monnify_account_name', 191).nullable();
					table.string('monnify_account_reference', 191).nullable();
					table.string('monnify_bank_name', 191).nullable();
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
    this.dropIfExists('third_party_app');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ThirdPartyAppSchema
