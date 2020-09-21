'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class OldAffiliateReferralSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('old_affiliate_referral', (table) => {
    			table.increments('id').unsigned();
					table.integer('affiliate_id').references('id').inTable('user').unsigned();
					table.integer('user_id').references('id').inTable('user').unsigned().nullable();
					table.integer('invoice_id').references('id').inTable('invoice').unsigned().nullable();
					table.integer('payment_id').references('id').inTable('old_payment').unsigned().nullable();
					table.integer('affiliate_resource_id').references('id').inTable('affiliate_resource').unsigned();
					table.string('ip_address', 20);
					table.text('user_agent');
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					table.integer('active_status', 3).references('id').inTable('active_status').unsigned().defaultTo('1');
					table.integer('old_invoice_id').references('id').inTable('old_invoice').unsigned().nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('old_affiliate_referral');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = OldAffiliateReferralSchema
