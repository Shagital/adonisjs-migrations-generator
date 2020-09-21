'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class Template_cachesSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('template_caches', (table) => {
    			table.increments('id').unsigned();
					table.string('reference', 255).nullable();
					table.string('country_code', 255).nullable();
					table.string('region_code', 255).nullable();
					table.string('city_name', 255).nullable();
					table.string('user_agent', 255).nullable();
					table.string('origin_url', 255).nullable();
					table.string('cookie_exist', 255).nullable();
					table.string('content_path', 255).nullable();
					table.specificType('created_at', 'datetime').nullable();
					table.specificType('updated_at', 'datetime').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('template_caches');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = Template_cachesSchema
