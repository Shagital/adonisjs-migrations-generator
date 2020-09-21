'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class LicensesSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('licenses', (table) => {
    			table.increments('id').unsigned();
					table.string('public_key', 190).unique().nullable();
					table.string('private_key', 255).nullable();
					table.integer('plan_id').nullable();
					table.timestamp('expires').nullable();
					table.string('product', 255).defaultTo('css').nullable();
					table.integer('used').defaultTo('0').nullable();
					table.integer('max').defaultTo('1').nullable();
					table.timestamp('created_at').defaultTo(Database.fn.now());
					table.timestamp('updated_at').defaultTo(Database.fn.now());
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('licenses');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = LicensesSchema
