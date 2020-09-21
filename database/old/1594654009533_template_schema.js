'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TemplateSchema extends Schema {
  up () {
    this.create('templates', (table) => {
      table.increments()
      table.string('name')
      table.string('type')
      table.string('content_path');
    })
  }

  async down () {
    this.drop('templates')
  }
}

module.exports = TemplateSchema
