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

// ADMIN ROUTES

Route.group(() => {
  Route.get('/dashboard', 'Admin/DashboardController.index')

  Route.get('/announcements', 'Admin/AnnouncementController.index')
}).prefix('admin').middleware(['auth:session', 'is:(administrator)'])

// API ROUTES

Route.group(() => {
  Route.get('/', () => {
    return { app_name: 'drawvania', version: '0.1' }
  })

  Route.post('login', 'Api/Auth/AuthenticationController.login')
  Route.post('register', 'Api/Auth/AuthenticationController.register')
  Route.get('me', 'Api/Auth/AuthenticationController.me').middleware(['auth:jwt'])

  Route.patch('settings/profile', 'Api/SettingsController.updateProfile').middleware(['auth:jwt'])
  Route.patch('settings/avatar', 'Api/SettingsController.updateAvatar').middleware(['auth:jwt'])
  Route.patch('settings/password', 'Api/SettingsController.updatePassword').middleware(['auth:jwt'])

  Route.get('feed/global', 'Api/FeedController.global')

  Route.post('posts', 'Api/PostController.store').middleware(['auth:jwt'])
  Route.get('posts/:id', 'Api/PostController.show')
  Route.patch('posts/:id', 'Api/PostController.update').middleware(['auth:jwt'])
  Route.delete('posts/:id', 'Api/PostController.destroy').middleware(['auth:jwt'])

  Route.get('posts/:id/likes', 'Api/PostController.likes')
  Route.post('posts/:id/like', 'Api/PostController.like').middleware(['auth:jwt'])
  Route.post('posts/:id/unlike', 'Api/PostController.unlike').middleware(['auth:jwt'])

  Route.get('posts/:id/comments', 'Api/CommentController.postIndex')
  Route.post('comments', 'Api/CommentController.store').middleware(['auth:jwt'])
  Route.patch('comments/:id', 'Api/CommentController.update').middleware(['auth:jwt'])
  Route.delete('comments/:id', 'Api/CommentController.destroy').middleware(['auth:jwt'])
  Route.post('comments/:id/reply', 'Api/CommentController.reply').middleware(['auth:jwt'])

  Route.get('posts/:id/redraws', 'Api/PostController.redraws')

  Route.get('users/:username', 'Api/UserController.show')

  Route.get('miscellaneous/weeklyRanking', 'Api/MiscellaneousController.weeklyRanking')
}).prefix('api')

// NORMAL ROUTES

Route.get('/', ({ view }) => view.render('home'))

Route.get('login', 'AuthenticationController.showLoginForm').middleware(['guest:session'])
Route.post('login', 'AuthenticationController.login').middleware(['guest:session'])
Route.get('logout', 'AuthenticationController.logout').middleware(['auth:session'])

// ERROR PAGES

Route.get('404', ({ view }) => view.render('errors/404'))
