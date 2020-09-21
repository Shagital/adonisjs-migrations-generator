'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class SubscriptionToUserSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('subscription_to_user', (table) => {
    			table.increments('id').unsigned();
					table.integer('subscription_id').references('id').inTable('subscription').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned().nullable();
					table.integer('managed_by_id').references('id').inTable('user').unsigned().nullable();
					table.integer('transfer_flag', 3).defaultTo('0');
					table.integer('product_id').references('id').inTable('product').unsigned();
					table.integer('new_product_id').references('id').inTable('product').unsigned().nullable();
					table.integer('month_access');
					table.integer('autobill', 3).defaultTo('1');
					table.text('metadata').nullable();
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
    this.dropIfExists('subscription_to_user');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = SubscriptionToUserSchema
