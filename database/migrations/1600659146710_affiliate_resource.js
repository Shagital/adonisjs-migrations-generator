'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class AffiliateResourceSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('affiliate_resource', (table) => {
    			table.increments('id').unsigned();
					table.integer('affiliate_material_id').references('id').inTable('affiliate_material').unsigned().nullable();
					table.enum('type', ['1','2']).nullable();
					table.string('name', 500);
					table.string('value', 1000);
					table.string('metadata', 1000);
					table.string('format', 100);
					table.text('description');
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
    this.dropIfExists('affiliate_resource');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = AffiliateResourceSchema
