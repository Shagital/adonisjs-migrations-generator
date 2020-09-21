'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class Feedback_entriesSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('feedback_entries', (table) => {
    			table.increments('id').unsigned();
					table.integer('feedback_id').references('id').inTable('feedbacks').unsigned().nullable();
					table.integer('feedback_user_id').references('id').inTable('feedback_users').unsigned().nullable();
					table.string('category', 255).nullable();
					table.text('rating').nullable();
					table.string('title', 255).nullable();
					table.text('description').nullable();
					table.timestamp('deleted_at').nullable();
					table.timestamp('created_at').defaultTo(Database.fn.now());
					table.timestamp('updated_at').defaultTo(Database.fn.now());
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('feedback_entries');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = Feedback_entriesSchema
