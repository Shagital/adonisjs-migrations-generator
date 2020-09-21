'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');
const env = use('Env').get('NODE_ENV');

class FeedbackSchema extends Schema {
  async up () {
    if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('feedbacks', (table) => {
      // id, name, feedback_type_id, user_id, webhook_url, feedback_template_id
      table.increments();
      table.enum('type', ['feedback', 'poll', 'survey']);
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('template_id').unsigned().references('id').inTable('templates');
      table.string('name');
      table.string('reference', 190).unique();
      table.integer('entry_count').defaultTo(0);
      table.string('description').nullable();
      table.text('meta').nullable();
      table.enum('status', [1, 2]).defaultTo(1)
      table.timestamp('deleted_at', { useTz: true }).nullable();
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('feedbacks')
  }
}

module.exports = FeedbackSchema
