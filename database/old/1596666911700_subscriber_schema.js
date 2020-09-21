'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubscriberSchema extends Schema {
  up () {
    this.create('subscribers', (table) => {
      table.increments()
      table.string('email', 100).unique();
      table.timestamps(true, true)
    })
  }

  down () {
    this.drop('subscribers')
  }
}

module.exports = SubscriberSchema
