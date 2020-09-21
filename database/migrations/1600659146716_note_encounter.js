'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class NoteEncounterSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('note_encounter', (table) => {
    			table.increments('id').unsigned();
					table.integer('note_id').references('id').inTable('notes').unsigned();
					table.integer('parent_id').references('id').inTable('note_encounter').unsigned().nullable();
					table.integer('rating', 3).unsigned();
					table.string('subject', 191);
					table.text('comment');
					table.text('notify_phone_number').nullable();
					table.text('notify_email_address').nullable();
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
    this.dropIfExists('note_encounter');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = NoteEncounterSchema
