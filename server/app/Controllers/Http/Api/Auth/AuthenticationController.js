'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')

class AuthenticationController {

  async register({ request, auth, response }) {
    const rules = {
      username: 'required|username|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required|min:8'
    }

    const { username, email, password } = request.only(['username', 'email', 'password'])

    const validation = await validateAll({ username, email, password }, rules);

    if (!validation.fails()) {
      try {
        const user = await User.create({ username, email, password })
        const token = await auth.generate(user)

        return response.json({
          status: 'success',
          data: token
        })
      } catch(error) {
        return response.status(400).json({
          status: 'error',
          message: 'There was a problem creating the user, please try again.'
        })
      }
    } else {
      response.status(400).send(validation.messages());
    }
  }

  async login({ request, auth, response }) {
    const rules = {
      email: 'required|email',
      password: 'required'
    }

    const { email, password } = request.only(['email', 'password']);

    const validation = await validateAll({ email, password }, rules);

    if (!validation.fails()) {
      try {
        const token = await auth.attempt(email, password)
        return response.json({
          status: 'success',
          data: token
        })
      } catch(error) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid email/password.'
        })
      }
    } else {
      response.status(400).send(validation.messages());
    }
  }

  async me({ auth, response }) {
    return response.json({
      status: 'success',
      data: auth.user
    })
  }

}

module.exports = AuthenticationController
