'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class AttachmentsSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('attachments', (table) => {
    			table.increments('id').unsigned();
					table.integer('object_id').nullable();
					table.string('object_type', 255).nullable();
					table.integer('user_id').references('id').inTable('users').unsigned().nullable();
					table.string('public_id', 255).nullable();
					table.string('url', 255).nullable();
					table.string('resource_type', 255).nullable();
					table.string('format', 255).nullable();
					table.timestamp('deleted_at').nullable();
					table.timestamp('created_at').defaultTo(Database.fn.now());
					table.timestamp('updated_at').defaultTo(Database.fn.now());
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('attachments');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = AttachmentsSchema
