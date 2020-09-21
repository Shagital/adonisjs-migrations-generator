'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class Quiz_questionsSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('quiz_questions', (table) => {
    			table.increments('id').unsigned();
					table.string('content', 255).nullable();
					table.integer('quiz_id').references('id').inTable('quizzes').unsigned().nullable();
					table.integer('next_question_id').references('id').inTable('quiz_questions').unsigned().nullable();
					table.enum('question_type', ['radio','checkbox','text']).nullable();
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
    this.dropIfExists('quiz_questions');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = Quiz_questionsSchema
