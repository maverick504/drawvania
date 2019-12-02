const pkg = require('./package')
require('dotenv').config()

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'x-ua-compatible', content: 'ie=edge,chrome=1' }
    ],
    htmlAttrs: {
      lang: 'en'
    },
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#7158e2',
    height: '3px'
  },

  /*
  ** CSS that will be bundled in the project.
  */
  css: ['~/assets/css/main.css'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/vue-tailwind', ssr: true },
    { src: '~plugins/event-bus', ssr: true },
    { src: '~plugins/global-components', ssr: true },
    { src: '~plugins/vue-moment', ssr: true },
    { src: '~plugins/axios', ssr: true },
    { src: '~plugins/vue-affix', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/router',
    '@nuxtjs/dotenv',
    'nuxt-purgecss'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_URL
  },

  /*
  ** Auth module configuration
  */
  auth: {
    redirect: {
      // WARNING: Do not use objects to define these routes, it gives the following error: 'nuxt a.split is not a function'.
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/'
    },
    watchLoggedIn: true,
    strategies: {
      local: {
        endpoints: {
          login: { url: 'login', method: 'post', propertyName: 'data.token' },
          user: { url: 'me', method: 'get', propertyName: 'data' },
          logout: false
        }
      }
    }
  },

  /*
  ** Dotenv module configuration
  */
  env: {
    baseUrl: process.env.BASE_URL,
    apiUrl: process.env.API_URL,
  },

  /*
  ** Purgecss module configuration
  */
  purgeCSS: {
    mode: 'postcss'
  },

  /*
  ** Build configuration
  */
  build: {
    analyze: false,
    extractCSS: true,

    /*
    ** PostCSS configuration
    */
    postcss: {
      plugins: {
        tailwindcss: 'tailwind.config.js'
      }
    },

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options : {
            fix : true
          }
        })
      }
    }
  }
}
