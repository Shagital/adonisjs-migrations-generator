'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ConsultationPrescriptionSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('consultation_prescription', (table) => {
    			table.increments('id').unsigned();
					table.integer('consultation_id').references('id').inTable('consultation').unsigned();
					table.integer('consultation_diagnosis_id').references('id').inTable('consultation_diagnosis').unsigned().nullable();
					table.integer('claim_id').references('id').inTable('claim').unsigned().nullable();
					table.integer('provider_id').references('id').inTable('provider').unsigned().nullable();
					table.string('code', 191).unique();
					table.text('metadata').nullable();
					table.enum('dispatch_status', ['1','2','3','4']);
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
    this.dropIfExists('consultation_prescription');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ConsultationPrescriptionSchema
