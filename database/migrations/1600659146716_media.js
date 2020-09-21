'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class MediaSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('media', (table) => {
    			table.specificType('id', 'bigint').unsigned();
					table.string('model_type', 255);
					table.specificType('model_id', 'bigint').unsigned();
					table.string('collection_name', 255);
					table.string('name', 255);
					table.string('file_name', 255);
					table.string('mime_type', 255).nullable();
					table.string('disk', 255);
					table.specificType('size', 'bigint').unsigned();
					table.specificType('manipulations', 'json');
					table.specificType('custom_properties', 'json');
					table.specificType('responsive_images', 'json');
					table.integer('order_column').unsigned().nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('media');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = MediaSchema
