'use strict'
const Database = use('Database');

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const env = use('Env').get('NODE_ENV');

class CitySchema extends Schema {
  async up () {
    if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('cities', (table) => {
      table.increments()
      table.string('name', 150);
      table.integer('country_id').unsigned().index('country_id')
      table.integer('state_id').unsigned().index('state_id')
      //table.foreign('country_id').references('countries.id');
      table.foreign('state_id').references('regions.id');
      table.string('country_code');
      table.string('state_code');
      table.decimal('latitude', 10, 8);
      table.decimal('longitude', 11, 8);
    });

    if(env != 'testing') {
      this.schedule(async (trx) => {
        await Database.raw("ALTER TABLE `cities` ADD UNIQUE `name_country`(`name`, `country_id`)")
      })
    }

  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('cities')
  }
}

module.exports = CitySchema
