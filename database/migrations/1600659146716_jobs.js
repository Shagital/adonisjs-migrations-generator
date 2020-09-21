'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class JobsSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('jobs', (table) => {
    			table.specificType('id', 'bigint').unsigned();
					table.string('queue', 191);
					table.specificType('payload', 'longtext');
					table.integer('attempts', 3).unsigned();
					table.integer('reserved_at').unsigned().nullable();
					table.integer('available_at').unsigned();
					table.integer('created_at').unsigned();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('jobs');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = JobsSchema
