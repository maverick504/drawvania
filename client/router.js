import Vue from 'vue'
import Router from 'vue-router'

const page = path => () => import(`~/pages/${path}`).then(m => m.default || m)

Vue.use(Router)

const routes = [
  { path: '/login', name: 'auth.login', component: page('auth/login.vue') },
  { path: '/register', name: 'auth.register', component: page('auth/register.vue') },

  { path: '/', name: 'home', component: page('home.vue') },

  { path: '/settings',
    component: page('settings/index.vue'),
    children: [
      { path: '', redirect: { name: 'settings.profile' } },
      { path: 'profile', name: 'settings.profile', component: page('settings/profile.vue') },
      { path: 'password', name: 'settings.password', component: page('settings/password.vue') }
    ]
  }
]


export function createRouter () {
  return new Router({
    routes,
    mode: 'history'
  })
}
