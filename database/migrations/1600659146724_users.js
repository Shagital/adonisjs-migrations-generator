'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const Database = use('Database');

class UsersSchema extends Schema {

  async up () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.create('users', (table) => {
    			table.specificType('id', 'bigint').unsigned();
					table.string('firstName', 255);
					table.string('lastName', 255);
					table.string('username', 255);
					table.string('middleName', 255).nullable();
					table.string('email', 255);
					table.string('password', 255);
					table.string('identifier', 255);
					table.string('phoneNumber', 255).nullable();
					table.enum('gender', ['MALE','FEMALE']).nullable();
					table.string('nin', 255).nullable();
					table.string('bvn', 255).nullable();
					table.timestamp('dob').nullable();
					table.string('mothersMaidenName', 255);
					table.enum('status', ['ACTIVE','IN_ACTIVE','PENDING']).defaultTo('ACTIVE');
					table.timestamp('email_verified_at').nullable();
					table.timestamp('created_at').nullable();
					table.timestamp('updated_at').nullable();
					
    });
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }

  async down () {
  Database.raw("SET FOREIGN_KEY_CHECKS=0").then( () => {
    this.dropIfExists('users');
    }).finally(function () {
      return Database.raw('SET FOREIGN_KEY_CHECKS=1;');
    });
  }
}

module.exports = UsersSchema
