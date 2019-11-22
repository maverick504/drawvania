'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {

  /*
  |--------------------------------------------------------------------------
  | Maximum Storage
  |--------------------------------------------------------------------------
  |
  | The maximum file storage for different user levels.
  |
  */

  maximumStorage: {
    common: Env.get('MAXIMUM_STORAGE_COMMON_USERS', 1024 * 1024 * 1024), // 1 GB
    premium: Env.get('MAXIMUM_STORAGE_PREMIUM_USERS', 1024 * 1024 * 1024 * 10) // 10 GB
  }
}
