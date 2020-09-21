'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database');
const env = use('Env').get('NODE_ENV');

class QuizAnswerSchema extends Schema {
  async up () {
    if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('quiz_answers', (table) => {
      // id, user_id, question_id, answer_id, description
      table.increments();
      table.integer('feedback_user_id').unsigned().references('id').inTable('feedback_users');
      table.integer('feedback_entry_id').unsigned().references('id').inTable('feedback_entries');
      table.integer('quiz_question_id').unsigned().references('id').inTable('quiz_questions');
      table.integer('question_option_id').unsigned().references('id').inTable('question_options');
      table.string('response');
      table.timestamp('deleted_at', { useTz: true }).nullable();
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('quiz_answers')
  }
}

module.exports = QuizAnswerSchema
