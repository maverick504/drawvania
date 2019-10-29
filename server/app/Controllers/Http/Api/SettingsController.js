'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')
const Hash = use('Hash')

class SettingsController {

  async updateProfile({ request, auth, response }) {
    const rules = {
      username: `required|username|unique:users,username,id,${auth.user.id}`,
      gender: `in:male,female`,
      location: `max:100`,
      about: `max:250`
    }

    const { username, gender, location, about } = request.only(['username', 'gender', 'location', 'about' ])

    const validation = await validateAll({ username, gender, location, about }, rules)

    if (!validation.fails()) {
      try {
        auth.user.username = username
        auth.user.gender = gender
        auth.user.location = location
        auth.user.about = about
        await auth.user.save()

        return response.json({
          status: 'success',
          data: auth.user
        })
      } catch(error) {
        return response.status(400).json({
          status: 'error',
          message: 'Something went wrong, please try again.'
        })
      }
    } else {
      response.status(400).send(validation.messages());
    }
  }

  async updateAvatar({ request, auth, response }) {
    const file = request.file('image', {
      types: ['image'],
      size: '2mb'
    })

    request.multipart.file('image', {}, async file => {
      await auth.user.setMedia(file, 'avatar')
    })

    await request.multipart.process()

    return response.json({
      status: 'success',
      data: auth.user
    })
  }

  async updatePassword({ request, auth, response }) {
    const rules = {
      current_password: 'required|min:8',
      new_password: 'required|min:8',
      new_password_confirmation: 'required'
    }

    const { current_password, new_password, new_password_confirmation } = request.only(['current_password', 'new_password', 'new_password_confirmation'])

    const validation = await validateAll({ current_password, new_password, new_password_confirmation }, rules);

    if (!validation.fails()) {
      const user = auth.user

      // Verify if the password confirmation matches with the new password
      const confirmationMatches = request.input('new_password') === request.input('new_password_confirmation')

      if(!confirmationMatches) {
        return response.status(400).json({
          status: 'error',
          message: "New password confirmation doesn't match! Please try again."
        })
      }

      // verify if current password matches with the password of the authenticated user
      const verifyPassword = await Hash.verify(
        request.input('current_password'),
        user.password
      )

      if (!verifyPassword) {
        return response.status(400).json({
          status: 'error',
          message: 'Current password could not be verified! Please try again.'
        })
      }

      try {
        // hash and save new password
        user.password = await Hash.make(request.input('new_password'))
        await user.save()

        return response.json({
          status: 'success',
          message: 'Password updated!'
        })
      } catch(error) {
        return response.status(400).json({
          status: 'error',
          message: 'There was a problem updating the password, please try again.'
        })
      }
    } else {
      response.status(400).send(validation.messages());
    }
  }

}

module.exports = SettingsController
