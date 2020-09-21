'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class BenefitToPlanSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('benefit_to_plan', (table) => {
    			table.increments('id').unsigned();
					table.integer('benefit_id').references('id').inTable('benefit').unsigned();
					table.integer('plan_id').references('id').inTable('hmo_plan').unsigned().nullable();
					table.integer('benefit_type_id').references('id').inTable('benefit_type').unsigned().nullable();
					table.text('value');
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
    this.dropIfExists('benefit_to_plan');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = BenefitToPlanSchema
