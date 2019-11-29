'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')

class AuthenticationController {

  async showLoginForm ({ view }) {
    return view.render('auth/login')
  }

  async login({ request, auth, response }) {
    const rules = {
      email: 'required|email',
      password: 'required'
    }

    const { email, password } = request.only(['email', 'password'])

    const validation = await validateAll({ email, password }, rules)

    if (!validation.fails()) {
      try {
        await auth.authenticator('session').attempt(email, password)

        response.redirect('/')
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

  async logout ({ auth, response }) {
    await auth.logout()

    response.redirect('/')
  }

}

module.exports = AuthenticationController
