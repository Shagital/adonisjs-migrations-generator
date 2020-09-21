'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class AppointmentsSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('appointments', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('provider_id').references('id').inTable('provider').unsigned();
					table.specificType('date_time', 'datetime');
					table.text('description');
					table.text('other_phone_to_inform').nullable();
					table.text('other_email_address_to_inform').nullable();
					table.string('status', 191).defaultTo('open');
					table.text('notification_jobs').nullable();
					table.specificType('notification_date_time', 'datetime').nullable();
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('appointments');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = AppointmentsSchema
