'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class PlansSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('plans', (table) => {
    			table.increments('id').unsigned();
					table.string('name', 255).nullable();
					table.string('payment_link', 255).nullable();
					table.enum('interval', ['monthly','yearly']).nullable();
					table.decimal('price', 11, 2).nullable();
					table.integer('duration').nullable();
					table.integer('recommended', 3).defaultTo('0').nullable();
					table.text('features').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('plans');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = PlansSchema
