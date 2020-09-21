'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class BenefitLimitSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('benefit_limit', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 191);
					table.string('description', 191);
					table.integer('benefit_limit_type_id').references('id').inTable('benefit_limit_type').unsigned();
					table.integer('time_frame_id').references('id').inTable('time_frame').unsigned().defaultTo('4');
					table.integer('for_family_plan', 3).defaultTo('0');
					table.specificType('created_at', 'datetime').defaultTo(Database.fn.now());
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('benefit_limit');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = BenefitLimitSchema
