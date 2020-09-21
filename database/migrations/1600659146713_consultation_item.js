'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ConsultationItemSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('consultation_item', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 191);
					table.enum('type', ['1','2']).defaultTo('1');
					table.string('dose', 191).nullable();
					table.integer('dosage_form_id').references('id').inTable('dosage_form').unsigned().nullable();
					table.integer('dosage_id').references('id').inTable('dosage').unsigned().nullable();
					table.string('duration', 191).nullable();
					table.integer('consultation_drug_class_id').references('id').inTable('consultation_drug_class').unsigned().nullable();
					table.enum('age_group', ['1','2']).nullable();
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
    this.dropIfExists('consultation_item');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ConsultationItemSchema
