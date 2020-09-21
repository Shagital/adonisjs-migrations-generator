const crypto = require('crypto');
const Env = use('Env');
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = Env.get('APP_KEY'); // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
let iv = Env.get('ENCRYPTION_KEY');
const bugsnag = use('BugSnag')
const fetch = use('node-fetch');
const url = Env.get('SLACK_WEBHOOK_URL');

async function slackLogger(error, request = {}, options = {}) {
  let requestAll = request.all();
  let requestHeaders = request.headers();

  let {
    level = 'error',
    channel = '#feedmonkey-errors',
    username = `[${Env.get('NODE_ENV')}]Backend Error`,
    meta = {}
  } = options;

  let payload = {};

  payload.text = "*" + level.toUpperCase() + ": * _" + error.name + "_ - `" + error.message + "`";
  payload.text += "\n>```" + error.stack + "```";

  if (!isEmpty(requestAll)) payload.text += "\n*REQUEST*: \n>```" + JSON.stringify(requestAll, null, 4) + "```";
  if (!isEmpty(requestHeaders)) payload.text += "\n*HEADERS: *\n>```" + JSON.stringify(requestHeaders, null, 4) + "```";
  if (!isEmpty(meta)) payload.text += "\n*Extra: *\n>```" + JSON.stringify(meta, null, 4) + "```";

  payload.channel = channel;
  payload.username = username;

  await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  })
    .then()
    .catch((error) => console.log(error));
}

function isEmpty(obj) {
  return (Object.keys(obj).length === 0 && obj.constructor === Object)
}

function random(length = 10, numeric = false) {
  var result = '';
  var characters = numeric ? "1234567890" : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function isMobile(userAgent) {
  return (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(userAgent))
  }

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

async function bugsnagLogger(error, request) {
  let metaData = {
    headers: request.headers(),
    format: request.format(),
    body: request.raw(),
    method: request.method().toLowerCase()
  };

  metaData[(metaData.method == "get" ? "querystring" : "entity_body")] = request.all()

  await bugsnag.notify(error, request, metaData);
}

function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

function addSlash( str ) {
  return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

module.exports = {
  random,
  isMobile,
  replaceAll,
  encrypt,
  decrypt,
  bugsnagLogger,
  slackLogger,
  addSlash
}
