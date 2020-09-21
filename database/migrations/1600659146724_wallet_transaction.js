'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class WalletTransactionSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('wallet_transaction', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned().nullable();
					table.integer('client_id').references('id').inTable('client').unsigned().nullable();
					table.decimal('amount', 15, 2);
					table.decimal('wallet_balance', 15, 2).defaultTo('0.00');
					table.string('object_id', 191).nullable();
					table.integer('wallet_transaction_type_id', 3).references('id').inTable('wallet_transaction_type').unsigned();
					table.integer('payment_id').references('id').inTable('payment').unsigned().nullable();
					table.integer('payment_state_id').references('id').inTable('payment_state').unsigned().defaultTo('5');
					table.string('transaction_reference', 300).nullable();
					table.text('comment').nullable();
					table.string('transfer_code', 100).nullable();
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
    this.dropIfExists('wallet_transaction');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = WalletTransactionSchema
