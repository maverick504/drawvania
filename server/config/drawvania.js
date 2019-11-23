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
  },

  /*
  |--------------------------------------------------------------------------
  | Unavailable Usernames
  |--------------------------------------------------------------------------
  |
  | Usernames that cannot be used, E.g.: drawvania, home, notifications, etc.
  | This isn't a profanity filter. There should be added usernames like
  | 'notifications' (https://app,drawvania.com/notifications), which interfers
  | with the notifications route.
  |
  */

  unavailableUsernames: [
    'drawvania',
    'auth',
    'login',
    'register',
    'account',
    'home',
    'browse',
    'explore',
    'search',
    'followings',
    'followers',
    'popular',
    't',
    'tag',
    'tags',
    'u',
    'user',
    'users',
    'p',
    'post',
    'posts',
    'notifications',
    'settings'
  ]
}
