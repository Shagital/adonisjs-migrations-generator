'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class PacodeSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('pacode', (table) => {
    			table.increments('id').unsigned();
					table.string('pacode', 9).unique();
					table.integer('provider_id').references('id').inTable('provider').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('benefit_limit_id').references('id').inTable('benefit').unsigned().nullable();
					table.text('other_email_addresses_to_inform').nullable();
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.text('comment');
					table.specificType('enrollee_score', 'double');
					table.specificType('review_sent_date', 'datetime');
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
    this.dropIfExists('pacode');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = PacodeSchema
