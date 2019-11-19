'use strict'

const User = use('App/Models/User')
const UserFollowing = use('App/Models/UserFollowing')

class UserController {

  async show({ params, auth }) {
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    // Check if the authenticated user is following this user.
    if(auth.user) {
      user.logged_in_user_is_follower = await auth.user.following(user.id)
    }

    return user
  }

  async followers({ request, params }) {
    // Check if the user exists.
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    // Return followers
    return await UserFollowing
    .query()
    .with('follower')
    .where('followed_id', '=', user.id)
    .paginate(request.get().page, 15)
  }

  async followings({ request, params }) {
    // Check if the user exists.
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    // Return followings
    return await UserFollowing
    .query()
    .with('followed')
    .where('follower_id', '=', user.id)
    .paginate(request.get().page, 15)
  }

  async follow({ params, auth, response }) {
    // Check if the user exists.
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    if(auth.user.id === user.id) {
      return response.status(400).json({
        status: 'error',
        message: "You can't follow yourself."
      })
    }

    // Check if the user was followed previously.
    const userFollowing = await UserFollowing
    .query()
    .withTrashed()
    .where('follower_id', '=', auth.user.id)
    .where('followed_id', '=', user.id)
    .first()

    // Attach the user.
    if(userFollowing) {
      await userFollowing.restore()
    } else {
      await user.followers().attach([auth.user.id])
    }

    // Recount followers.
    await user.countFollowers()

    // Recount followings.
    await auth.user.countFollowings()
  }

  async unfollow({ params, auth, response }) {
    // Check if the user exists.
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    // Detach the follower.
    await user.followers().detach([auth.user.id])

    // Recount followers.
    await user.countFollowers()

    // Recount followings.
    await auth.user.countFollowings()
  }

}

module.exports = UserController
