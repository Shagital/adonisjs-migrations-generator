'use strict'
const Database = use('Database');

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const env = use('Env').get('NODE_ENV');

class RegionSchema extends Schema {
  async up () {
    if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('regions', (table) => {
      table.increments()
      table.string('name', 150);
      table.integer('country_id').unsigned();
      table.foreign('country_id').references('countries.id');
      table.string('country_code', 5);
      table.string('state_code', 10);
    })

    if(env != 'testing') {
      this.schedule(async (trx) => {
        await Database.raw("ALTER TABLE `regions` ADD UNIQUE `name_country`(`name`, `country_id`)")
      });
    }
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('regions')
  }
}

module.exports = RegionSchema
