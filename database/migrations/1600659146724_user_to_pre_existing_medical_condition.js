'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class UserToPreExistingMedicalConditionSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('user_to_pre_existing_medical_condition', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('pre_existing_medical_condition_id').references('id').inTable('pre_existing_medical_condition').unsigned();
					table.specificType('created_at', 'datetime').defaultTo(Database.fn.now());
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('user_to_pre_existing_medical_condition');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = UserToPreExistingMedicalConditionSchema
