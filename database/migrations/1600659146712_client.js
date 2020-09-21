'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ClientSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('client', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 100);
					table.string('short_code', 5).unique();
					table.string('phone_number', 15);
					table.string('email_address', 100);
					table.string('logo_url', 50).defaultTo('company.png');
					table.string('address', 150);
					table.integer('state_id').references('id').inTable('state').unsigned();
					table.integer('industry_id').references('id').inTable('industry').unsigned();
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.integer('managed_by').references('id').inTable('user').unsigned();
					table.integer('retained_by').references('id').inTable('user').unsigned().nullable();
					table.integer('init_value').unsigned().defaultTo('10001');
					table.integer('staff_strength').unsigned().defaultTo('0');
					table.integer('hmo_package_id').references('id').inTable('hmo_package').unsigned().defaultTo('2');
					table.integer('add_remove_access', 3).defaultTo('0');
					table.integer('has_custom_end_date', 3).defaultTo('0');
					table.decimal('utilization_ratio', 15, 2).defaultTo('0.00');
					table.integer('is_whitelabelled', 3).defaultTo('0');
					table.decimal('wallet_balance', 15, 2).defaultTo('0.00');
					table.string('monnify_account_reference', 191).nullable();
					table.string('monnify_account_number', 191).nullable();
					table.string('monnify_account_name', 191).nullable();
					table.string('monnify_bank_name', 191).nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('2');
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('client');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ClientSchema
