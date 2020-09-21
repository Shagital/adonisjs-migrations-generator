'use strict'
const Database = use('Database');

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const env = use('Env').get('NODE_ENV');

class CountrySchema extends Schema {
  async up () {
    if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('countries', (table) => {
      table.increments()
      table.string('name', 190).unique();
      table.string('iso3', 5).unique();
      table.string('iso2', 5).unique();
      table.string('phone_code');
      table.string('capital');
      table.string('currency', 10);
      table.string('native');
      table.string('emoji');
      table.string('emojiU');
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('countries')
  }
}

module.exports = CountrySchema
