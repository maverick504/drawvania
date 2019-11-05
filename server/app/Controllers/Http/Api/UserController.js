'use strict'

const User = use('App/Models/User')

class UserController {

  async show({ params }) {
    return await User.query().where('username', '=', params.username).firstOrFail()
  }

}

module.exports = UserController
