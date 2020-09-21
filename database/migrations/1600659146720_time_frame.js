'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class TimeFrameSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('time_frame', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 50).unique();
					table.integer('multiplier').unsigned();
					table.specificType('created_at', 'datetime').defaultTo(Database.fn.now());
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('time_frame');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = TimeFrameSchema