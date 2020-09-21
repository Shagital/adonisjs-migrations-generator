'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class TicketThreadSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('ticket_thread', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('ticket_id').references('id').inTable('ticket').unsigned();
					table.integer('ticket_status_id').references('id').inTable('ticket_status').unsigned().defaultTo('1');
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
    this.dropIfExists('ticket_thread');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = TicketThreadSchema
