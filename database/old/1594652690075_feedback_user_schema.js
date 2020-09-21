'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')
const env = use('Env').get('NODE_ENV');

class FeedbackUserSchema extends Schema {
  async up () {
    if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('feedback_users', (table) => {
      //  id, email, name, browser, location, meta
      table.increments()
      table.string('first_name')
      table.string('last_name')
      table.string('email', 190)
      table.integer('feedback_id').unsigned().references('id').inTable('feedbacks');
      table.string('phone').nullable();
      table.string('browser').nullable();
      table.string('ip_address').nullable();
      table.bool('is_mobile').default(false);
      table.integer('city_id').nullable().unsigned().references('id').inTable('cities');
      table.integer('region_id').nullable().unsigned().references('id').inTable('regions');
      table.integer('country_id').nullable().unsigned().references('id').inTable('countries');
      table.text('meta').nullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('feedback_users')
  }
}

module.exports = FeedbackUserSchema
