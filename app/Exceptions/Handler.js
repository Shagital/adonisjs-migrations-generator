'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')
const {slackLogger:logger} = use('App/Common/helpers');

  /**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param response
   * @param session
   *
   * @return {void}
   */
  async handle (error, { response, session }) {
      response.status(error.status).send(
        process.env.NODE_ENV === 'production'
          ? 'An error occurred'
          : {message: error.message, stack: error.stack}
          )
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
    if(process.env.NODE_ENV === 'production') await logger(error, request)
  }
}

module.exports = ExceptionHandler
