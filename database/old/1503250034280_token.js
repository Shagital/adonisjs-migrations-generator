'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')
let env = use('Env').get('NODE_ENV');

class TokensSchema extends Schema {
  async up () {
    if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('tokens', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('token', 190).notNullable().unique().index()
      table.string('type', 80).notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('tokens')
  }
}

module.exports = TokensSchema
