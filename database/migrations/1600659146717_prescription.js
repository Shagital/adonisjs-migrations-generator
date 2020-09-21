'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class PrescriptionSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('prescription', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('is_recurring', 3).defaultTo('1');
					table.integer('no_of_days').unsigned().defaultTo('7');
					table.enum('status', ['1','2']).defaultTo('1');
					table.decimal('total_price', 15, 2).defaultTo('0.00');
					table.text('address');
					table.text('note');
					table.integer('skip_pec_check', 3).defaultTo('0');
					table.specificType('dispatch_date', 'date').nullable();
					table.specificType('dispatched_at', 'datetime').nullable();
					table.integer('created_by').references('id').inTable('user').unsigned().nullable();
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
    this.dropIfExists('prescription');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = PrescriptionSchema
