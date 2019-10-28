'use strict'

const User = use('App/Models/User')

class UserController {

  async show({ response, params }) {
    var user = await User.query().where('username', '=', params.username).firstOrFail()

    return user
  }

}

module.exports = UserController
