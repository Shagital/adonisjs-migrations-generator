'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ReimbursementThreadsSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('reimbursement_threads', (table) => {
    			table.increments('id').unsigned();
					table.integer('responded_by').references('id').inTable('user').unsigned();
					table.integer('reimbursement_id').references('id').inTable('reimbursements').unsigned();
					table.text('comment').nullable();
					table.integer('status').unsigned();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('reimbursement_threads');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ReimbursementThreadsSchema
