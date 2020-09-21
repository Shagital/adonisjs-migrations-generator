'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class AffiliateMaterialSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('affiliate_material', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 100);
					table.string('code', 3).unique();
					table.string('summary', 1000);
					table.string('url', 1000);
					table.integer('created_by').references('id').inTable('user').unsigned().defaultTo('1').nullable();
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
    this.dropIfExists('affiliate_material');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = AffiliateMaterialSchema