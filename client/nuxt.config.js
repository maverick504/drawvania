const pkg = require('./package')

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
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#7158e2',
    height: '4px'
  },

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
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/router',
    '@nuxtjs/tailwindcss'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: 'http://127.0.0.1:3333/api',
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
  ** Build configuration
  */
  build: {
    extractCSS: true,
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
