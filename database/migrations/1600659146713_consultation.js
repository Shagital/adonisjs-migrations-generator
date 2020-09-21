'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ConsultationSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('consultation', (table) => {
    			table.increments('id').unsigned();
					table.integer('parent_consultation_id').references('id').inTable('consultation').unsigned().nullable();
					table.integer('patient_id').references('id').inTable('user').unsigned();
					table.integer('doctor_id').references('id').inTable('user').unsigned().nullable();
					table.enum('medium', ['1','2']);
					table.enum('consultation_status', ['1','2','3','4','5','6','7','8']).defaultTo('1').nullable();
					table.text('content').nullable();
					table.integer('rating').unsigned().defaultTo('0');
					table.text('rating_comment');
					table.decimal('total_cost', 15, 2).defaultTo('0.00');
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.integer('claim_id').references('id').inTable('claim').unsigned().nullable();
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
    this.dropIfExists('consultation');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ConsultationSchema
