'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')
const env = use('Env').get('NODE_ENV');

class QuizSchema extends Schema {
  async up () {
    if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('quizzes', (table) => {
      table.increments();
      table.integer('feedback_id').unsigned().references('id').inTable('feedbacks');
      table.string('name').nullable();
      table.string('description').nullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('quizzes')
  }
}

module.exports = QuizSchema
