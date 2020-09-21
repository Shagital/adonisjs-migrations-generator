'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ProviderSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('provider', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 100);
					table.integer('type_id').references('id').inTable('provider_type').unsigned();
					table.integer('tier_id').references('id').inTable('tier').unsigned();
					table.integer('is_onboarded', 3).defaultTo('0');
					table.string('address', 500);
					table.integer('state_id').references('id').inTable('state').unsigned().defaultTo('25');
					table.string('location', 50).nullable();
					table.string('telephone', 500).nullable();
					table.string('email_address', 500).nullable();
					table.string('website_address', 100).nullable();
					table.string('registration_number', 50).nullable();
					table.string('hours_of_operation', 500).nullable();
					table.string('scope_of_services', 500).nullable();
					table.decimal('amount_deposited', 15, 2).nullable();
					table.decimal('deposited_amount_balance', 15, 2).nullable();
					table.decimal('latitude', 10, 8).defaultTo('0.00000000');
					table.decimal('longitude', 11, 8).defaultTo('0.00000000');
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.integer('managed_by').references('id').inTable('user').unsigned();
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
    this.dropIfExists('provider');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ProviderSchema
