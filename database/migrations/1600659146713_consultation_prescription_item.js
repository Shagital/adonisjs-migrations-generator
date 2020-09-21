'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ConsultationPrescriptionItemSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('consultation_prescription_item', (table) => {
    			table.increments('id').unsigned();
					table.integer('consultation_prescription_id').references('id').inTable('consultation_prescription').unsigned();
					table.integer('consultation_item_id').references('id').inTable('consultation_item').unsigned();
					table.integer('consultation_diagnosis_id').references('id').inTable('consultation_diagnosis').unsigned().nullable();
					table.integer('quantity').unsigned();
					table.enum('dispatch_status', ['1','2','3']);
					table.text('comment').nullable();
					table.integer('is_result_positive', 3).nullable();
					table.text('result_comment').nullable();
					table.integer('file_id').references('id').inTable('file').unsigned().nullable();
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
    this.dropIfExists('consultation_prescription_item');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ConsultationPrescriptionItemSchema
