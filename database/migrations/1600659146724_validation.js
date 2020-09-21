'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ValidationSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('validation', (table) => {
    			table.increments('id').unsigned();
					table.string('hmo_id', 50);
					table.integer('user_id').references('id').inTable('user').unsigned().nullable();
					table.integer('provider_id').references('id').inTable('provider').unsigned();
					table.integer('method_id').references('id').inTable('validation_method').unsigned();
					table.integer('status_id').references('id').inTable('validation_status').unsigned();
					table.integer('validated_by').references('id').inTable('user').unsigned().defaultTo('1');
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('validation');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ValidationSchema
