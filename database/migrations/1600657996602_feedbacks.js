'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class FeedbacksSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('feedbacks', (table) => {
    			table.increments('id').unsigned();
					table.enum('type', ['feedback','poll','survey']).nullable();
					table.integer('user_id').references('id').inTable('users').unsigned().nullable();
					table.integer('template_id').references('id').inTable('templates').unsigned().nullable();
					table.string('name', 255).nullable();
					table.string('reference', 190).unique().nullable();
					table.integer('entry_count').defaultTo('0').nullable();
					table.string('description', 255).nullable();
					table.text('meta').nullable();
					table.enum('status', ['1','2']).defaultTo('1').nullable();
					table.timestamp('deleted_at').nullable();
					table.timestamp('created_at').defaultTo(Database.fn.now());
					table.timestamp('updated_at').defaultTo(Database.fn.now());
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('feedbacks');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = FeedbacksSchema
