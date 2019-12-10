'use strict'

class Register {

  get validateAll () {
    return true
  }

  get rules () {
    return {
      username: 'required|username|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required|min:8'
    }
  }

  get messages () {
    return {

      'username.required': 'An username is required for your account',
      'username.username': 'Usernames must have between 1 and 20 characters and shouldn\'t contain spaces or special characters',
      'username.unique': 'There\'s already an account with this username',

      'email.required': 'An email address is required for your account',
      'email.email': 'This email address is not valid',
      'email.unique': 'There\'s already an account with this email address',

      'password.required': 'A password is required for your account',
      'password.min': 'The password must be at least 8 characters of length'

    }
  }

}

module.exports = Register
