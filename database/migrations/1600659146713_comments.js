'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class CommentsSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('comments', (table) => {
    			table.increments('id').unsigned();
					table.integer('parent_id').references('id').inTable('comments').unsigned().nullable();
					table.integer('commentable_id').unsigned();
					table.string('commentable_type', 191);
					table.text('body');
					table.integer('created_by').references('id').inTable('user').unsigned();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('comments');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = CommentsSchema
