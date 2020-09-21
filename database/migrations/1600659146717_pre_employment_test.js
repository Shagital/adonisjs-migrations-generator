'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class PreEmploymentTestSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('pre_employment_test', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 100);
					table.integer('provider_id').references('id').inTable('provider').unsigned();
					table.integer('payment_state_id').references('id').inTable('payment_state').unsigned().defaultTo('1');
					table.decimal('total_price', 15, 2).defaultTo('0.00');
					table.string('reference', 100);
					table.string('transfer_code', 100).nullable();
					table.text('description');
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
    this.dropIfExists('pre_employment_test');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = PreEmploymentTestSchema
