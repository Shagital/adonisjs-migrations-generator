'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TemplateCacheSchema extends Schema {
  up () {
    this.create('template_caches', (table) => {
      table.increments()
      table.string('reference');
      table.string('country_code');
      table.string('region_code');
      table.string('city_name');
      table.string('user_agent');
      table.string('origin_url');
      table.string('cookie_exist');
      table.string('content_path');
      table.timestamps()
    })
  }

  down () {
    this.drop('template_caches')
  }
}

module.exports = TemplateCacheSchema
