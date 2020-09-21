'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ClientValidityPeriodSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('client_validity_period', (table) => {
    			table.increments('id').unsigned();
					table.integer('client_id').references('id').inTable('client').unsigned();
					table.specificType('start_date', 'date');
					table.specificType('end_date', 'date');
					table.specificType('mid_cycle_date', 'date').nullable();
					table.integer('payment_frequency_id').references('id').inTable('time_frame').unsigned().nullable();
					table.specificType('created_at', 'datetime').defaultTo(Database.fn.now());
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('client_validity_period');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ClientValidityPeriodSchema
