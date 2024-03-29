import Vue from 'vue'
import Router from 'vue-router'
import { scrollBehavior } from '~/utils'

const page = path => () => import(`~/pages/${path}`).then(m => m.default || m)

Vue.use(Router)

const routes = [
  { path: '/login', name: 'auth.login', component: page('auth/login.vue') },
  { path: '/register', name: 'auth.register', component: page('auth/register.vue') },

  { path: '/stats', name: 'stats', component: page('stats.vue') },

  { path: '/challenges', name: 'challenges.index', component: page('challenges/index.vue') },
  { path: '/challenges/:id', name: 'challenges.show', component: page('challenges/show.vue') },

  { path: '/tutorials', name: 'tutorials', component: page('tutorials.vue') },

  { path: '/explore', name: 'feed.global', component: page('feeds/global.vue'), alias: '/' },
  { path: '/followings', name: 'feed.followings', component: page('feeds/followings.vue') },

  { path: '/explore/hashtags/:slug', name: 'explore.hashtags', component: page('explore/hashtags.vue') },

  { path: '/posts/:id', name: 'posts.show', component: page('posts/show.vue') },

  { path: '/settings',
    component: page('settings/index.vue'),
    children: [
      { path: '', redirect: { name: 'settings.profile' } },
      { path: 'profile', name: 'settings.profile', component: page('settings/profile.vue'), meta: { group: 'settings' } },
      { path: 'password', name: 'settings.password', component: page('settings/password.vue'), meta: { group: 'settings' } }
    ]
  },

  // The 'users' route should be always at the end of the routes array.
  { path: '/:username', name: 'users.show', component: page('users/show/index.vue') },
]

export function createRouter () {
  return new Router({
    routes,
    scrollBehavior,
    mode: 'history'
  })
}
