'use strict'

const Event = use('Event')

// AUTH events
Event.on('AUTH_REGISTER', 'Auth.register')
Event.on('AUTH_RESEND_CONFIRMATION', 'Auth.sendConfirmEmail')
Event.on('AUTH_FORGOT_PASSWORD', 'Auth.forgotPassword')
