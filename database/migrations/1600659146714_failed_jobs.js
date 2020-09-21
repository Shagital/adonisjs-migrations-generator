'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class FailedJobsSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('failed_jobs', (table) => {
    			table.specificType('id', 'bigint').unsigned();
					table.text('connection');
					table.text('queue');
					table.specificType('payload', 'longtext');
					table.specificType('exception', 'longtext');
					table.timestamp('failed_at').defaultTo(Database.fn.now());
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('failed_jobs');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = FailedJobsSchema
