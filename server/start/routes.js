'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.group(() => {
  Route.post('login', 'Api/Auth/AuthenticationController.login')
  Route.post('register', 'Api/Auth/AuthenticationController.register')
  Route.get('me', 'Api/Auth/AuthenticationController.me').middleware(['auth'])

  Route.patch('settings/profile', 'Api/SettingsController.updateProfile').middleware(['auth'])
  Route.patch('settings/avatar', 'Api/SettingsController.updateAvatar').middleware(['auth'])
  Route.patch('settings/password', 'Api/SettingsController.updatePassword').middleware(['auth'])

  Route.get('users/:username', 'Api/UserController.show')
}).prefix('api')

Route.get('/', () => {
  return { app_name: 'drawvania', version: '0.1' }
})
