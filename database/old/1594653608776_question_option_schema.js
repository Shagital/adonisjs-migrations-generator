'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database');
const env = use('Env').get('NODE_ENV');

class QuestionOptionSchema extends Schema {
  async up () {
    if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('question_options', (table) => {
      table.increments()
      table.integer('quiz_question_id').unsigned().references('id').inTable('quiz_questions');
      table.string('content');
      table.timestamp('deleted_at', { useTz: true }).nullable();
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('question_options')
  }
}

module.exports = QuestionOptionSchema
