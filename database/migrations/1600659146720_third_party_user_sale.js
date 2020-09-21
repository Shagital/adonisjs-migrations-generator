'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class ThirdPartyUserSaleSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('third_party_user_sale', (table) => {
    			table.increments('id').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned();
					table.integer('agent_id').references('id').inTable('user').unsigned();
					table.integer('third_party_id').references('id').inTable('third_party_app').unsigned();
					table.integer('subscription_to_user_id').references('id').inTable('subscription_to_user').unsigned().nullable();
					table.integer('iccu_id').references('id').inTable('invoice_client_combo_to_user').unsigned().nullable();
					table.string('product_name', 191);
					table.decimal('product_price', 15, 2);
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
    this.dropIfExists('third_party_user_sale');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = ThirdPartyUserSaleSchema
