'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ClaimBatchSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('claim_batch', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 50);
					table.integer('provider_id').references('id').inTable('provider').unsigned();
					table.decimal('total_price', 15, 2).defaultTo('0.00');
					table.string('transfer_code', 100).nullable();
					table.integer('payment_state_id').references('id').inTable('payment_state').unsigned().defaultTo('1');
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.integer('paid_by').references('id').inTable('user').unsigned().nullable();
					table.specificType('paid_at', 'datetime').nullable();
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
    this.dropIfExists('claim_batch');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ClaimBatchSchema
