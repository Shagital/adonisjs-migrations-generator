'use strict'
const {random} = use("App/Common/helpers")
/*
|--------------------------------------------------------------------------
| AuthSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const {encrypt, decrypt} = use('App/Common/helpers')

class AuthSeeder {
  async run () {
    console.info('running auth seeder');
    let zac = await Factory
      .model('App/Models/User')
      .create();
    zac.email = 'djunehor@gmail.com';
    zac.password = 'julianah';
    zac.plan_id = 5;
    zac.public_key = '1234567890abcdefghijklmnopqrstuvwxyz';
    zac.private_key = encrypt(zac.public_key);
    await zac.save();

    let raph = await Factory
      .model('App/Models/User')
      .create();
    raph.email = 'rapheal@baobabpartners.com';
    zac.plan_id = 5;
    raph.password = 'password';
    await raph.save();
  }
}

module.exports = AuthSeeder
