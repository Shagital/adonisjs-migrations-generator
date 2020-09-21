'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class DynamicCallListSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('dynamic_call_list', (table) => {
    			table.increments('id').unsigned();
					table.integer('parent_id').references('id').inTable('dynamic_call_list').unsigned().nullable();
					table.string('first_name', 50);
					table.string('last_name', 50);
					table.string('phone_number', 15).nullable();
					table.string('email_address', 100).nullable();
					table.integer('dynamic_call_list_category_id').references('id').inTable('dynamic_call_list_category').unsigned();
					table.integer('object_id').unsigned().nullable();
					table.integer('weight').unsigned();
					table.text('extra_call_details').nullable();
					table.text('outcome_reason').nullable();
					table.enum('outcome_type', ['1','2','3','4','5']).nullable();
					table.integer('handled_by').references('id').inTable('user').unsigned().nullable();
					table.specificType('lock_time', 'datetime').nullable();
					table.specificType('call_time', 'datetime');
					table.specificType('callback_time', 'datetime').nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('2');
					table.integer('ticket_id').references('id').inTable('ticket').unsigned().nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('dynamic_call_list');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = DynamicCallListSchema
