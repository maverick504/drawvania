'use strict'

const User = use('App/Models/User')
const Post = use('App/Models/Post')

class DashboardController {

  async index ({ view }) {
    const countUsers = await User.query().count()
    const totalUsers = countUsers[0]['count(*)']

    const countPremiumUsers = await User.query().whereNotNull('upgraded_premium_at').count()
    const totalPremiumUsers = countPremiumUsers[0]['count(*)']

    const countPosts = await Post.query().count()
    const totalPosts = countPosts[0]['count(*)']

    const latestRegisteredUsers = await User.query().orderBy('created_at', 'desc').limit(10).fetch()

    return view.render('admin.dashboard', {
      totalUsers: totalUsers,
      totalPremiumUsers: totalPremiumUsers,
      totalPosts: totalPosts,
      latestRegisteredUsers: latestRegisteredUsers.toJSON()
    })
  }

}

module.exports = DashboardController
