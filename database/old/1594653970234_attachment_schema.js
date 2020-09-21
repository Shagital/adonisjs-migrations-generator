'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AttachmentSchema extends Schema {
  up () {
    this.create('attachments', (table) => {
      table.increments()
      table.integer('object_id').nullable()
      table.string('object_type').nullable()
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('public_id')
      table.string('url')
      table.string('resource_type')
      table.string('format');
      table.timestamp('deleted_at', { useTz: true }).nullable();
      table.timestamps(true, true)
    })
  }

  down () {
    this.drop('attachments')
  }
}

module.exports = AttachmentSchema
