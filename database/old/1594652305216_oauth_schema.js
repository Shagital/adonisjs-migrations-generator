'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database');
let env = use('Env').get('NODE_ENV');

class OauthSchema extends Schema {
  async up () {
    if(env != 'testing') await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.create('oauths', (table) => {
      table.increments()
      table.string('unique_id', 190).unique()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.enum('provider', ['facebook', 'twitter', 'google'])
      table.timestamps(true, true)
    })
  }

  async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('oauths')
  }
}

module.exports = OauthSchema
