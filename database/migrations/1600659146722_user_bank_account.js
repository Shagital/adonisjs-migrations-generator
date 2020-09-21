'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class UserBankAccountSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('user_bank_account', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.string('account_name', 100);
					table.string('account_number', 50);
					table.integer('bank_id').references('id').inTable('bank').unsigned();
					table.integer('bank_type_id').references('id').inTable('bank_type').unsigned().nullable();
					table.integer('use_type').unsigned().defaultTo('1');
					table.string('recipient_code', 100).nullable();
					table.integer('cash_outs').unsigned().defaultTo('0');
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
    this.dropIfExists('user_bank_account');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = UserBankAccountSchema
