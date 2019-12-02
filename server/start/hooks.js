const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Validator = use('Validator')
  const Database = use('Database')
  const Config = use('Config')
  const View = use('Adonis/Src/View')

  const existsFn = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
      */
      return
    }

    const [table, column] = args
    const row = await Database.table(table).where(column, value).first()

    if (!row) {
      throw message
    }
  }

  const minFn = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return
    }

    const minLength = parseInt(args[0])
    if(typeof value === 'string') {
      if(value.length < minLength) {
        throw message
      }
    } else {
      if(value < minLength) {
        throw message
      }
    }
  }

  const maxFn = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return
    }

    const maxLength = parseInt(args[0])
    if(typeof value === 'string') {
      if(value.length > maxLength) {
        throw message
      }
    } else {
      if(value > maxLength) {
        throw message
      }
    }
  }

  const inFn = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return
    }

    const values = args
    if(!values.includes(value)) {
      throw message
    }
  }

  const usernameFn = async (data, field, message, args, get) => {
    const value = get(data, field)

    const validUsername = /^[a-zA-Z0-9_]{1,20}$/.test(value)

    const unavailableUsernames = Config.get('drawvania.unavailableUsernames')

    if(unavailableUsernames.includes(value)) {
      throw message
    }

    if(!validUsername) {
      throw message
    }
  }

  const redrawablePostFn = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return
    }

    const post = await Database.table('posts').where('id', '=', value).first()
    if(!post || !post.redrawable) {
      throw message
    }
  }

  Validator.extend('exists', existsFn)
  Validator.extend('min', minFn)
  Validator.extend('max', maxFn)
  Validator.extend('in', inFn)
  Validator.extend('username', usernameFn)
  Validator.extend('redrawablePost', redrawablePostFn)

  // Make the configuration accessible in all views.
  View.global('config', function (key) {
    return Config.get(key)
  })
})
