'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class BenefitLimitToHmoPlanSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('benefit_limit_to_hmo_plan', (table) => {
    			table.increments('id').unsigned();
					table.integer('benefit_limit_id').references('id').inTable('benefit_limit').unsigned();
					table.integer('hmo_plan_id').references('id').inTable('hmo_plan').unsigned();
					table.integer('value').unsigned().defaultTo('0');
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
    this.dropIfExists('benefit_limit_to_hmo_plan');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = BenefitLimitToHmoPlanSchema
