'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ClaimItemSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('claim_item', (table) => {
    			table.increments('id').unsigned();
					table.integer('claim_id').references('id').inTable('claim').unsigned();
					table.integer('provider_tariff_id').references('id').inTable('provider_tariff').unsigned().nullable();
					table.text('item');
					table.string('quantity', 50);
					table.decimal('unit_price', 15, 2);
					table.decimal('total_price', 15, 2);
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
    this.dropIfExists('claim_item');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ClaimItemSchema
