'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class EnrolleeProfileSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('enrollee_profile', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('parent_id').references('id').inTable('user').unsigned().nullable();
					table.string('hmo_id', 50).unique();
					table.integer('client_id').references('id').inTable('client').unsigned().nullable();
					table.integer('title_id').unsigned().nullable();
					table.string('other_names', 50);
					table.string('home_address', 191);
					table.integer('home_address_state_id').references('id').inTable('state').unsigned().defaultTo('25');
					table.string('home_phone_number', 15);
					table.string('sex', 1);
					table.specificType('date_of_birth', 'date');
					table.integer('nationality_id').references('id').inTable('country').unsigned();
					table.integer('enrollee_type_id').references('id').inTable('enrollee_type').unsigned();
					table.integer('risk_level_id').references('id').inTable('risk_level').unsigned().defaultTo('1');
					table.integer('has_smartphone', 3).defaultTo('0');
					table.string('company_name', 191);
					table.string('office_address', 191);
					table.string('office_phone_number', 15);
					table.integer('occupation_id').references('id').inTable('occupation').unsigned();
					table.string('position', 100);
					table.integer('marital_status_id').references('id').inTable('marital_status').unsigned().defaultTo('1');
					table.integer('preferred_provider_id').references('id').inTable('provider').unsigned().nullable();
					table.string('preferred_provider_name', 191);
					table.string('preferred_provider_location', 191);
					table.string('profile_picture', 50).defaultTo('avatar.png');
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
    this.dropIfExists('enrollee_profile');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = EnrolleeProfileSchema
