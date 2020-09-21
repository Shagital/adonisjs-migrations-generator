'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class PlanSchema extends Schema {
  up () {
    this.create('plans', (table) => {
      table.increments();
      table.string('name');
      table.string('payment_link');
      table.enum('interval', ['monthly', 'yearly']);
      table.decimal('price', 11, 2);
      table.integer('duration', 2); // in months
      table.boolean('recommended').defaultTo(false); // in months
      table.text('features').nullable();
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('plans')
  }
}

module.exports = PlanSchema
