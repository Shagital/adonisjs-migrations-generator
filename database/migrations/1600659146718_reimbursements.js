'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ReimbursementsSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('reimbursements', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.string('request_code', 191).nullable();
					table.text('details').nullable();
					table.decimal('amount', 15, 2);
					table.text('evidence').nullable();
					table.string('reference', 50).nullable();
					table.string('transfer_code', 100).nullable();
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.integer('status').unsigned().defaultTo('0');
					table.specificType('request_filled_at', 'datetime').nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('reimbursements');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ReimbursementsSchema
