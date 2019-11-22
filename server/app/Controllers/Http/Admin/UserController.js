'use strict'

const User = use('App/Models/User')

class UserController {

  async index ({ request, view }) {
    const users = await User.query().paginate(request.get().page, 15)

    return view.render('admin.users.index', { users: users.toJSON() })
  }

  async show ({ params, view }) {
    const user = await User.findOrFail(params.id)

    return view
    .presenter('UserPresenter')
    .render('admin.users.show', {
      user: user.toJSON()
    })
  }

  async upgradeToPremium({ params, response }) {
    // Get the required user
    const user = await User.findOrFail(params.id)

    // Check if the user is premium already.
    if(user.upgraded_premium_at !== null) {
      // Already premium. Redirect to the user page.
      response.redirect(`/admin/users/${params.id}`)
      return
    }

    // Upgrade the user to premium
    user.upgraded_premium_at = new Date()
    await user.save()

    // Redirect to the user page.
    response.redirect(`/admin/users/${params.id}`)
  }

  async removePremium({ params, response }) {
    // Get the required user
    const user = await User.findOrFail(params.id)

    // Remove premium
    user.upgraded_premium_at = null
    await user.save()

    // Redirect to the user page.
    response.redirect(`/admin/users/${params.id}`)
  }

}

module.exports = UserController
