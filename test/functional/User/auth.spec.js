const {test, trait} = use('Test/Suite')('AuthController Test')
const Factory = use('Factory')
const chance = require('chance').Chance();

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')
trait('DatabaseTransactions')

let payload = () => {
  return {
    "email": chance.email(),
    "username": chance.name(),
    "first_name": chance.first(),
    "last_name": chance.last(),
    "password": chance.apple_token(),
    "private_key": chance.string({alpha:true, length:32}),
    "public_key": chance.string({alpha:true, length:32}),
  }
}

test('can register', async ({client, assert}) => {
  let data = payload();
  const response = await client.post('api/auth/register').send(data).end();
  response.assertStatus(200);
  assert.equal(data.email, JSON.parse(response.text).email)
})

test('can fetch logged in user profile', async ({client}) => {
  let user = await Factory
    .model('App/Models/User')
    .create();

  const profile = await client.get('api/auth/me').loginVia(user).end();
  profile.assertStatus(200);

})

test('can login', async ({client}) => {
  let data = payload();

  let user = await Factory
    .model('App/Models/User')
    .create({
      email : data.email,
      password : data.password
    });

  const profile = await client.post('api/auth/login').send({email: data.email, password:data.password}).end();
  profile.assertStatus(200);

})

