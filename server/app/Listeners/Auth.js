'use strict'

const Env = use('Env')
const Mail = use('Mail')
const Auth = exports = module.exports = {}

const app_from_title = Env.get('APP_FROM_TITLE')
const app_from_email = Env.get('APP_FROM_EMAIL')

Auth.register = async (user) => {
  // send confirmation e-mail.
  await Mail.send('emails.welcome', { token: user.email_confirmation_token }, (message) => {
    message.from(`${app_from_title} <${app_from_email}>`)
    message.subject('Welcome')
    message.to(user.email)
  })
}

Auth.sendConfirmEmail = async (user) => {
  // send confirmation mail.
  await Mail.send('emails.confirmEmail', { token: user.email_confirmation_token }, (message) => {
    message.from(`${app_from_title} <${app_from_email}>`)
    message.subject('Verification email')
    message.to(user.email)
  })
}

Auth.forgotPassword = async (user) => {
  // send password reset mail.
  await Mail.send('emails.forgotPassword', { token: user.password_reset_token }, (message) => {
    message.from(`${app_from_title} <${app_from_email}>`)
    message.subject('Reset password')
    message.to(user.email)
  })
}
