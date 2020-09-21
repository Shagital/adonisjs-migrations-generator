'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ProviderTariffSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('provider_tariff', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 200);
					table.decimal('price', 15, 2);
					table.integer('tariff_type_id').references('id').inTable('tariff_type').unsigned();
					table.integer('provider_id').references('id').inTable('provider').unsigned();
					table.specificType('lock_time', 'datetime').nullable();
					table.integer('tariff_id').references('id').inTable('tariff').unsigned().nullable();
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
    this.dropIfExists('provider_tariff');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ProviderTariffSchema
