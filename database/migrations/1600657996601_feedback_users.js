'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class Feedback_usersSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('feedback_users', (table) => {
    			table.increments('id').unsigned();
					table.string('first_name', 255).nullable();
					table.string('last_name', 255).nullable();
					table.string('email', 190).nullable();
					table.integer('feedback_id').references('id').inTable('feedbacks').unsigned().nullable();
					table.string('phone', 255).nullable();
					table.string('browser', 255).nullable();
					table.string('ip_address', 255).nullable();
					table.integer('is_mobile', 3).defaultTo('0').nullable();
					table.integer('city_id').references('id').inTable('cities').unsigned().nullable();
					table.integer('region_id').references('id').inTable('regions').unsigned().nullable();
					table.integer('country_id').references('id').inTable('countries').unsigned().nullable();
					table.text('meta').nullable();
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
    this.dropIfExists('feedback_users');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = Feedback_usersSchema
