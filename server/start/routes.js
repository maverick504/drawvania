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
const Config = use('Config')

// ADMIN ROUTES

Route.group(() => {

  Route.get('dashboard', 'Admin/DashboardController.index')

  Route.get('users', 'Admin/UserController.index')
  Route.get('users/:id', 'Admin/UserController.show')
  Route.patch('users/:id/upgrade-to-premium', 'Admin/UserController.upgradeToPremium')
  Route.patch('users/:id/remove-premium', 'Admin/UserController.removePremium')

  Route.get('posts', 'Admin/PostController.index')
  Route.get('posts/:id', 'Admin/PostController.show')
  Route.delete('posts/:id', 'Admin/PostController.destroy')

  Route.get('feedback', 'Admin/FeedbackMessageController.index')

}).prefix('admin').middleware(['auth:session', 'is:(administrator)'])

// API ROUTES

Route.group(() => {

  Route.get('/', () => {
    return { app_name: 'drawvania', version: '0.1' }
  })

  Route.post('login', 'Api/Auth/AuthenticationController.login').validator('auth/Login')
  Route.post('register', 'Api/Auth/AuthenticationController.register').validator('auth/Register')
  Route.get('me', 'Api/Auth/AuthenticationController.me').middleware(['auth:jwt'])
  Route.post('send-confirm-email' , 'Api/Auth/AuthenticationController.sendConfirmEmail').middleware(['auth:jwt'])

  Route.patch('settings/profile', 'Api/SettingsController.updateProfile').middleware(['auth:jwt'])
  Route.patch('settings/avatar', 'Api/SettingsController.updateAvatar').middleware(['auth:jwt'])
  Route.patch('settings/password', 'Api/SettingsController.updatePassword').middleware(['auth:jwt'])

  Route.get('pull', 'Api/PullController.index').middleware(['auth:jwt'])

  Route.get('notifications', 'Api/NotificationController.index').middleware(['auth:jwt'])
  Route.post('notifications/:id/mark-as-read', 'Api/NotificationController.markAsRead').middleware(['auth:jwt'])

  Route.get('feed/global', 'Api/FeedController.global')
  Route.get('feed/followings', 'Api/FeedController.followings').middleware(['auth:jwt'])

  Route.get('users/:username', 'Api/UserController.show')
  Route.get('users/:username/followers', 'Api/UserController.followers')
  Route.get('users/:username/followings', 'Api/UserController.followings')
  Route.post('users/:username/follow', 'Api/UserController.follow').middleware(['auth:jwt'])
  Route.post('users/:username/unfollow', 'Api/UserController.unfollow').middleware(['auth:jwt'])

  Route.get('users/:username/posts', 'Api/PostController.userIndex')
  Route.post('posts', 'Api/PostController.store').middleware(['auth:jwt'])
  Route.get('posts/:id', 'Api/PostController.show')
  Route.get('posts/:id/redraws', 'Api/PostController.redraws')
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

  Route.post('comments/:id/like', 'Api/CommentController.like').middleware(['auth:jwt'])
  Route.post('comments/:id/unlike', 'Api/CommentController.unlike').middleware(['auth:jwt'])

  Route.get('featured-hashtags', 'Api/HashtagController.featured')
  Route.get('explore/hashtags/:slug', 'Api/PostController.hashtagIndex')

  Route.post('feedback', 'Api/FeedbackMessageController.store').middleware(['auth:jwt'])

}).prefix('api').middleware('throttle:30,60')

// SESSION AUTHENTICATION ROUTES

// Login, logout.
Route.on('/login').render('auth.login')
Route.get('/logout', 'AuthenticationController.logout').middleware(['auth:session'])

// Confirm email.
Route.get('/confirm-email/:token', 'AuthenticationController.confirmEmail')

// Forgot/reset password.
Route.on('/forgot-password').render('auth.forgotPassword')
Route.get('/reset-password/:token', 'AuthenticationController.renderResetPassword')

Route.group(() => {

  Route.post('/login', 'AuthenticationController.login')
  Route.post('/forgot-password' , 'AuthenticationController.forgotPassword')
  Route.post('/reset-password'  , 'AuthenticationController.resetPassword')

}).prefix('auth')

// NORMAL ROUTES

Route.get('/', ({ response }) => response.redirect(Config.get('drawvania.subdomains.app')))
// Route.on('/premium').render('premium.landing')

// ERROR PAGES

Route.get('404', ({ view }) => view.render('errors/404'))
