'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const moment = use('moment');
const {encrypt, decrypt} = use('App/Common/helpers')

Factory.blueprint('App/Models/User', (faker, i, data) => {
  let publicKey = faker.string({length:64, alpha:true});
  let privateKey = encrypt(publicKey);
  return {
    username: faker.string({alpha:true, length:16}),
    first_name: faker.first(),
    plan_id: faker.integer({min:1, max:5}),
    last_name: faker.last(),
    password: data.password || faker.password(),
    email: data.email || faker.email(),
    private_key: privateKey,
    public_key: publicKey,
    subscription_ends: data.subscription_ends || moment().add('1','days').format('YYYY-MM-DD HH:mm:ss'),
    meta:{send_email:true}
  }
});
