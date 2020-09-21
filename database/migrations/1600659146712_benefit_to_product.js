'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class BenefitToProductSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('benefit_to_product', (table) => {
    			table.increments('id').unsigned();
					table.integer('benefit_id').references('id').inTable('benefit').unsigned();
					table.integer('product_id').references('id').inTable('product').unsigned();
					table.integer('benefit_type_id').references('id').inTable('benefit_type').unsigned().nullable();
					table.text('value');
					table.integer('is_family_exempt', 3).defaultTo('0');
					table.integer('month_access');
					table.enum('benefit_access_type', ['1','2']).defaultTo('1');
					table.integer('time_frame_id').references('id').inTable('time_frame').unsigned().nullable();
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
    this.dropIfExists('benefit_to_product');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = BenefitToProductSchema
