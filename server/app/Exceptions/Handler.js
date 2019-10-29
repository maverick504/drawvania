'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

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
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    console.log(error)

    if(error.name === 'HttpException' && error.message.startsWith('E_ROUTE_NOT_FOUND')) {
      if(!request.request.url.startsWith('/api/')) {
        return response.redirect('/404')
      }
    } else if(error.name === 'InvalidSessionException' || error.name === 'ForbiddenException') {
      // For security reasons, We don't want the user to know if this is an admin route, so we redirect to 404 page.
      if(!request.request.url.startsWith('/api/')) {
        return response.redirect('/404')
      }
    } else if(error.name === 'HttpException' && error.message.startsWith('E_GUEST_ONLY')) {
      return response.redirect('/')
    }

    response.status(error.status).send(error.message)
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
  }
}

module.exports = ExceptionHandler
