'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class FeedbackMetricSchema extends Schema {
  up () {
    this.create('feedback_metrics', (table) => {
      table.increments()
      table.string('reference');
      table.integer('feedback_id').unsigned().references('id').inTable('feedbacks');
      table.integer('feedback_entry_id').unsigned().references('id').inTable('feedback_entries');
      table.integer('feedback_user_id').unsigned().references('id').inTable('feedback_users');
      table.bool('submitted');
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('feedback_metrics')
  }
}

module.exports = FeedbackMetricSchema
