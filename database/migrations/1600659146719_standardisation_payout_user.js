'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class StandardisationPayoutUserSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('standardisation_payout_user', (table) => {
    			table.increments('id').unsigned();
					table.integer('standardisation_payout_id').references('id').inTable('standardisation_payout').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('valid_tariffs').unsigned();
					table.integer('pending_tariffs').unsigned();
					table.integer('invalid_tariffs').unsigned();
					table.decimal('cash_made', 15, 2).defaultTo('0.00');
					table.decimal('cash_projected', 15, 2).defaultTo('0.00');
					table.decimal('payout', 15, 2).defaultTo('0.00');
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
    this.dropIfExists('standardisation_payout_user');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = StandardisationPayoutUserSchema
