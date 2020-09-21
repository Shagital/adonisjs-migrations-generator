'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')
const env = use('Env').get('NODE_ENV');

class QuizQuestionSchema extends Schema {
 async  up () {
   if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('quiz_questions', (table) => {
      // id, content, next_id, type
      table.increments();
      table.string('content');
      table.integer('quiz_id').unsigned().references('id').inTable('quizzes');
      table.integer('next_question_id').nullable().unsigned().references('id').inTable('quiz_questions');
      table.enum('question_type', ['radio', 'checkbox', 'text']);
      table.timestamp('deleted_at', { useTz: true }).nullable();
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('quiz_questions')
  }
}

module.exports = QuizQuestionSchema
