import Vue from 'vue'
import Router from 'vue-router'
import { scrollBehavior } from '~/utils'

const page = path => () => import(`~/pages/${path}`).then(m => m.default || m)

Vue.use(Router)

const routes = [
  { path: '/login', name: 'auth.login', component: page('auth/login.vue') },
  { path: '/register', name: 'auth.register', component: page('auth/register.vue') },

  { path: '/', name: 'home', component: page('home.vue') },

  { path: '/posts/:id', name: 'posts.show', component: page('posts/show.vue') },

  { path: '/settings',
    component: page('settings/index.vue'),
    children: [
      { path: '', redirect: { name: 'settings.profile' } },
      { path: 'profile', name: 'settings.profile', component: page('settings/profile.vue'), meta: { group: 'settings' } },
      { path: 'password', name: 'settings.password', component: page('settings/password.vue'), meta: { group: 'settings' } },
      { path: 'notifications', name: 'settings.notifications', component: page('settings/notifications.vue'), meta: { group: 'settings' } }
    ]
  }
]

export function createRouter () {
  return new Router({
    routes,
    scrollBehavior,
    mode: 'history'
  })
}
