'use strict'

class Login {

  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required',
      password: 'required'
    }
  }

  get messages () {
    return {

      'email.required': 'Please enter your account\'s email',

      'password.required': 'Please enter your account\'s password'

    }
  }

}

module.exports = Login
