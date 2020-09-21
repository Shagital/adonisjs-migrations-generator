'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class MonthlyGrowthRecordSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('monthly_growth_record', (table) => {
    			table.specificType('id', 'bigint').unsigned();
					table.integer('type', 3).unsigned();
					table.specificType('year', 'year');
					table.integer('month', 3).unsigned();
					table.specificType('target_price', 'double').nullable();
					table.specificType('actual_price', 'double').nullable();
					table.specificType('target', 'bigint').unsigned().nullable();
					table.specificType('actual', 'bigint').unsigned().nullable();
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.specificType('actual_updated', 'datetime');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('monthly_growth_record');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = MonthlyGrowthRecordSchema
