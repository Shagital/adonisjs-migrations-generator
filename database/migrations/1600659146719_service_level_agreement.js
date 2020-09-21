'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ServiceLevelAgreementSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('service_level_agreement', (table) => {
    			table.increments('id').unsigned();
					table.string('file_name', 191).nullable();
					table.specificType('content', 'mediumtext').nullable();
					table.enum('type', ['1']);
					table.string('object_id', 191);
					table.integer('created_by').references('id').inTable('user').unsigned();
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
    this.dropIfExists('service_level_agreement');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ServiceLevelAgreementSchema
