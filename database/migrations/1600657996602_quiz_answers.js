'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class Quiz_answersSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('quiz_answers', (table) => {
    			table.increments('id').unsigned();
					table.integer('feedback_user_id').references('id').inTable('feedback_users').unsigned().nullable();
					table.integer('feedback_entry_id').references('id').inTable('feedback_entries').unsigned().nullable();
					table.integer('quiz_question_id').references('id').inTable('quiz_questions').unsigned().nullable();
					table.integer('question_option_id').references('id').inTable('question_options').unsigned().nullable();
					table.string('response', 255).nullable();
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
    this.dropIfExists('quiz_answers');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = Quiz_answersSchema
