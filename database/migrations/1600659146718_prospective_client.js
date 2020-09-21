'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ProspectiveClientSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('prospective_client', (table) => {
    			table.increments('id').unsigned();
					table.string('client_name', 100);
					table.string('address', 150);
					table.integer('state_id').references('id').inTable('state').unsigned();
					table.integer('industry_id').references('id').inTable('industry').unsigned();
					table.integer('staff_strength').unsigned().defaultTo('0');
					table.string('admin_first_name', 50);
					table.string('admin_last_name', 50);
					table.string('admin_phone_number', 15).nullable();
					table.string('admin_email_address', 100);
					table.decimal('total_price', 15, 2).defaultTo('0.00');
					table.string('reference_code', 191).nullable();
					table.string('access_code', 100).nullable();
					table.integer('payment_frequency_id').references('id').inTable('time_frame').unsigned().nullable();
					table.text('cart').nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('2');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('prospective_client');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ProspectiveClientSchema
