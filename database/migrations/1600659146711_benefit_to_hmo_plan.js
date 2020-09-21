'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class BenefitToHmoPlanSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('benefit_to_hmo_plan', (table) => {
    			table.increments('id').unsigned();
					table.integer('benefit_id').references('id').inTable('benefit').unsigned();
					table.integer('hmo_plan_id').references('id').inTable('hmo_plan').unsigned();
					table.string('value', 1000);
					table.specificType('created_at', 'datetime').defaultTo(Database.fn.now());
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('benefit_to_hmo_plan');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = BenefitToHmoPlanSchema
