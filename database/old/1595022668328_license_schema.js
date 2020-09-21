'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LicenseSchema extends Schema {
  up () {
    this.create('licenses', (table) => {
      table.increments()
      table.string('public_key', 190).unique()
      table.string('private_key')
      table.integer('plan_id').nullable();
      table.timestamp('expires')
      table.string('product').defaultTo('css');
      table.integer('used').defaultTo(0)
      table.integer('max').defaultTo(1)
      table.timestamps(true, true)
    })
  }

  down () {
    this.drop('licenses')
  }
}

module.exports = LicenseSchema
