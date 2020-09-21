'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class AffiliateReferralItemSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('affiliate_referral_item', (table) => {
    			table.increments('id').unsigned();
					table.integer('affiliate_referral_id').references('id').inTable('old_affiliate_referral').unsigned();
					table.integer('affiliate_product_id').references('id').inTable('affiliate_product').unsigned();
					table.integer('value').unsigned();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('affiliate_referral_item');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = AffiliateReferralItemSchema
