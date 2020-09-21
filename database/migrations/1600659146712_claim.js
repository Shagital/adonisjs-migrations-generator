'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ClaimSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('claim', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('provider_id').references('id').inTable('provider').unsigned();
					table.specificType('encountered_at', 'date');
					table.integer('claim_service_id', 3).references('id').inTable('claim_service').unsigned().defaultTo('1');
					table.string('pa_code', 50);
					table.string('code_authorized_by', 50);
					table.text('diagnosis');
					table.string('admission_duration', 10);
					table.string('doctor_name', 50);
					table.decimal('total_price', 15, 2).defaultTo('0.00');
					table.string('claim_hash', 191).unique().nullable();
					table.integer('payment_state_id').references('id').inTable('payment_state').unsigned().defaultTo('1');
					table.text('note');
					table.integer('submission_speed').defaultTo('0');
					table.integer('declined_count').defaultTo('0');
					table.integer('pacode_compliance').defaultTo('0');
					table.integer('review_sent', 3).defaultTo('0');
					table.specificType('claim_score', 'double').defaultTo('0.00');
					table.specificType('enrollee_score', 'double').defaultTo('0.00');
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
    this.dropIfExists('claim');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ClaimSchema
