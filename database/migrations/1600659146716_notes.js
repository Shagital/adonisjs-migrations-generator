'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class NotesSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('notes', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('provider_id').references('id').inTable('provider').unsigned().nullable();
					table.string('title', 191);
					table.string('contact_medium', 191);
					table.text('details');
					table.specificType('score', 'double').defaultTo('0.00');
					table.enum('status', ['1','2','3','4']).defaultTo('1');
					table.integer('notify', 3).defaultTo('1');
					table.enum('category', ['Complaint','Inquiry','Request']).nullable();
					table.integer('active_status', 3).unsigned().defaultTo('1');
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.integer('department_id').references('id').inTable('department').unsigned().nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.specificType('incidence_id', 'bigint').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('notes');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = NotesSchema
