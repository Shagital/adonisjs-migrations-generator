'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class BenefitLimitToHmoPlanToClientComboSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('benefit_limit_to_hmo_plan_to_client_combo', (table) => {
    			table.increments('id').unsigned();
					table.integer('benefit_limit_to_hmo_plan_id').references('id').inTable('benefit_limit_to_hmo_plan').unsigned();
					table.integer('time_frame_id').references('id').inTable('time_frame').unsigned();
					table.integer('client_to_combo_id').references('id').inTable('client_to_combo').unsigned();
					table.integer('value').unsigned();
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
    this.dropIfExists('benefit_limit_to_hmo_plan_to_client_combo');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = BenefitLimitToHmoPlanToClientComboSchema
