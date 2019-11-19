'use strict'

const Database = use('Database')
const Post = use('App/Models/Post')

class FeedController {

  async global({ request, auth }) {
    var query = Post.query()

    if(auth.user) {
      query
      .select([
        'posts.*',
        Database.raw("IF((`post_likes`.`id` IS NOT NULL AND `post_likes`.`deleted_at` IS NULL), 1, 0) AS logged_in_user_liked")
      ])
      .leftJoin('post_likes', function () {
        this
        .on('post_id', 'posts.id')
        .on('user_id', auth.user.id)
      })
      .with('author', (builder) => {
        builder
        .select([
          'users.*',
          Database.raw("IF((`user_followings`.`id` IS NOT NULL AND `user_followings`.`deleted_at` IS NULL), 1, 0) AS logged_in_user_is_follower")
        ])
        .leftJoin('user_followings', function () {
          this.on('user_followings.followed_id', 'users.id')
          this.on('user_followings.follower_id', auth.user.id)
        })
      })
    } else {
      query
      .select([ 'posts.*' ])
      .with('author')
    }

    return await query
    .with('media')
    .with('parentPost.author')
    .with('parentPost.media')
    .where('posts.date', '<=', new Date())
    .orderBy('posts.created_at', 'desc')
    .paginate(request.get().page, 5)
  }

  async followings({ request, auth }) {
    return await Post
    .query()
    .select([
      'posts.*',
      Database.raw("IF((`post_likes`.`id` IS NOT NULL AND `post_likes`.`deleted_at` IS NULL), 1, 0) AS logged_in_user_liked"),
    ])
    .leftJoin('post_likes', function () {
      this
      .on('post_id', 'posts.id')
      .on('user_id', auth.user.id)
    })
    .join('user_followings', function () {
      this
      .on('followed_id', 'posts.author_id')
      .on('follower_id', auth.user.id)
    })
    .with('author', (builder) => {
      builder
      .select([
        'users.*',
        Database.raw("1 AS logged_in_user_is_follower")
      ])
    })
    .with('media')
    .with('parentPost.author')
    .with('parentPost.media')
    .where('posts.date', '<=', new Date())
    .whereNull('user_followings.deleted_at')
    .orderBy('posts.created_at', 'desc')
    .paginate(request.get().page, 5)
  }

}

module.exports = FeedController
