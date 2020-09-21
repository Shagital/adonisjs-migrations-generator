'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')
const env = use('Env').get('NODE_ENV');

class FeedbackEntrySchema extends Schema {
  async up () {
    if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('feedback_entries', (table) => {
      // id, feedback_id, feed_back_user_id
      table.increments()
      table.integer('feedback_id').unsigned().references('id').inTable('feedbacks')
      table.integer('feedback_user_id').unsigned().references('id').inTable('feedback_users');
      table.string('category').nullable();
      table.text('rating').nullable();
      table.string('title').nullable();
      table.text('description').nullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('feedback_entries')
  }
}

module.exports = FeedbackEntrySchema
