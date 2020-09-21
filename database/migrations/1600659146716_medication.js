'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class MedicationSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('medication', (table) => {
    			table.increments('id').unsigned();
					table.integer('prescription_id').references('id').inTable('prescription').unsigned();
					table.integer('provider_tariff_id').references('id').inTable('provider_tariff').unsigned();
					table.integer('dosage_id').references('id').inTable('dosage').unsigned();
					table.integer('quantity').unsigned().defaultTo('1');
					table.integer('dosage_form_id').references('id').inTable('dosage_form').unsigned();
					table.decimal('price', 15, 2);
					table.text('comment');
					table.integer('is_expense', 3).defaultTo('0');
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
    this.dropIfExists('medication');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = MedicationSchema
