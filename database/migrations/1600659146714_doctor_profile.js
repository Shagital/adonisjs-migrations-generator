'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class DoctorProfileSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('doctor_profile', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.string('other_name', 191);
					table.string('signature', 191).nullable();
					table.enum('sex', ['m','f']);
					table.specificType('date_of_birth', 'date');
					table.string('profile_picture', 191);
					table.string('mdcn', 191);
					table.integer('specialty_id').references('id').inTable('specialty').unsigned();
					table.string('workplace_name', 191);
					table.string('workplace_address', 191);
					table.string('position', 191);
					table.specificType('rating', 'double').defaultTo('0');
					table.enum('online_status', ['1','2']).defaultTo('2');
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
    this.dropIfExists('doctor_profile');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = DoctorProfileSchema
