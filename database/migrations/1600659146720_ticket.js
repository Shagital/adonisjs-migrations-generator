'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class TicketSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('ticket', (table) => {
    			table.increments('id').unsigned();
					table.text('title');
					table.text('description');
					table.string('resolution_time', 191).nullable();
					table.timestamp('expected_at').nullable();
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.integer('department_id').unsigned();
					table.integer('ticket_status_id').references('id').inTable('ticket_status').unsigned().defaultTo('1');
					table.string('jira_issue_id', 191).nullable();
					table.enum('type', ['Request','Bug','Feature']).nullable();
					table.text('metadata').nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					table.specificType('dynamic_call_list_id', 'bigint').unsigned().nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('ticket');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = TicketSchema
