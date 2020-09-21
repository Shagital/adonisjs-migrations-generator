'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ClaimCommentSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('claim_comment', (table) => {
    			table.increments('id').unsigned();
					table.integer('claim_id').references('id').inTable('claim').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.text('comment');
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
    this.dropIfExists('claim_comment');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ClaimCommentSchema