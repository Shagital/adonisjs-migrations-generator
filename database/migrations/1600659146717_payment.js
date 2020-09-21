'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class PaymentSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('payment', (table) => {
    			table.increments('id').unsigned();
					table.integer('invoice_id').references('id').inTable('invoice').unsigned();
					table.integer('payment_status_id').references('id').inTable('payment_status').unsigned().defaultTo('1');
					table.string('reference_code', 191);
					table.decimal('price', 15, 2);
					table.string('comment', 191);
					table.integer('created_by').references('id').inTable('user').unsigned().defaultTo('1');
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
    this.dropIfExists('payment');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = PaymentSchema
