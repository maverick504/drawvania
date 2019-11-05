const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Validator = use('Validator')
  const Database = use('Database')

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

    const validUsername = /^[a-zA-Z0-9_]{1,25}$/.test(value)

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

  Validator.extend('min', minFn)
  Validator.extend('max', maxFn)
  Validator.extend('in', inFn)
  Validator.extend('username', usernameFn)
  Validator.extend('redrawablePost', redrawablePostFn)
})
