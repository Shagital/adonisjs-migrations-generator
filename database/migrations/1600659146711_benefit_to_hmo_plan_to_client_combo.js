'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class BenefitToHmoPlanToClientComboSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('benefit_to_hmo_plan_to_client_combo', (table) => {
    			table.increments('id').unsigned();
					table.integer('benefit_to_hmo_plan_id').references('id').inTable('benefit_to_hmo_plan').unsigned();
					table.integer('client_combo_id').references('id').inTable('client_to_combo').unsigned();
					table.string('value', 1000);
					table.integer('month_access').unsigned().defaultTo('0');
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					table.integer('is_family_exempt', 3).defaultTo('0');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('benefit_to_hmo_plan_to_client_combo');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = BenefitToHmoPlanToClientComboSchema
