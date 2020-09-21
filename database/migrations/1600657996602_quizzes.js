'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class QuizzesSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('quizzes', (table) => {
    			table.increments('id').unsigned();
					table.integer('feedback_id').references('id').inTable('feedbacks').unsigned().nullable();
					table.string('name', 255).nullable();
					table.string('description', 255).nullable();
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
    this.dropIfExists('quizzes');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = QuizzesSchema
