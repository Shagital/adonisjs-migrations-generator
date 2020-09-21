'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('first_name', 80).nullable()
      table.string('last_name', 80).nullable()
      table.string('email', 100).notNullable().unique()
      table.string('password').notNullable()
      table.string('photo_url').nullable()
      table.string('ip_address').nullable()
      table.string('private_key').notNullable()
      table.string('public_key').notNullable()
      table.integer('plan_id').nullable()
      table.timestamp('subscription_ends').nullable()
      table.text('meta').nullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
      table.timestamps(true, true)
    })
  }

 async down () {
    await Database.raw("SET FOREIGN_KEY_CHECKS=0;");
    this.drop('users')
  }
}

module.exports = UserSchema
