'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ProductSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('product', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 191).nullable();
					table.enum('type', ['1','2']);
					table.integer('parent_id').references('id').inTable('product').unsigned().nullable();
					table.integer('plan_id').references('id').inTable('hmo_plan').unsigned();
					table.integer('extension_id').references('id').inTable('extension').unsigned().nullable();
					table.integer('plan_type_id').references('id').inTable('hmo_plan_type').unsigned();
					table.integer('package_type_id').references('id').inTable('hmo_package').unsigned();
					table.decimal('price', 15, 2);
					table.integer('client_id').references('id').inTable('client').unsigned().nullable();
					table.integer('is_retail_exempt', 3).defaultTo('0');
					table.integer('provider_default', 3).defaultTo('1');
					table.integer('is_custom', 3).defaultTo('0');
					table.integer('cc_id').nullable();
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
    this.dropIfExists('product');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ProductSchema
