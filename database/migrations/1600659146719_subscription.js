'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class SubscriptionSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('subscription', (table) => {
    			table.increments('id').unsigned();
					table.integer('parent_id').references('id').inTable('subscription').unsigned().nullable();
					table.integer('invoice_id').references('id').inTable('invoice').unsigned();
					table.integer('client_id').references('id').inTable('client').unsigned();
					table.integer('frequency_id').references('id').inTable('time_frame').unsigned();
					table.integer('new_frequency_id').references('id').inTable('time_frame').unsigned().nullable();
					table.integer('payment_status_id').references('id').inTable('payment_status').unsigned();
					table.integer('autobill', 3).defaultTo('1');
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.specificType('start_date', 'date');
					table.specificType('end_date', 'date');
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
    this.dropIfExists('subscription');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = SubscriptionSchema
