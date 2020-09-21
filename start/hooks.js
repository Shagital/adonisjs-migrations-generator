const { hooks } = require('@adonisjs/ignitor');
const { ioc } = use('@adonisjs/fold');

hooks.after.providersBooted(() => {
  const Validator = use('Validator');
  const Database = use('Database');

  const existsFn = async (data, field, message, args, get) => {
    const value = get(data, field);
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return
    }

    const [table, column] = args;
    const row = await Database.table(table).where(column, value).first()

    if (!row) {
      throw message
    }
  };

  Validator.extend('exists', existsFn);

  ioc.bind('FakeContext', () => {
    const HttpContext = use('Adonis/Src/HttpContext')
    const httpMocks = use('node-mocks-http')
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
    });
    const res = httpMocks.createResponse()
    return new HttpContext(req, res)
  })
})
