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
          Database.raw("IF((`user_follows`.`id` IS NOT NULL AND `user_follows`.`deleted_at` IS NULL), 1, 0) AS logged_in_user_is_follower")
        ])
        .leftJoin('user_follows', function () {
          this.on('user_follows.followed_id', 'users.id')
          this.on('user_follows.follower_id', auth.user.id)
        })
      })
    } else {
      query
      .select([ 'posts.*' ])
      .with('author')
    }

    const posts = await query
    .with('media')
    .with('parentPost.author')
    .with('parentPost.media')
    .where('posts.date', '<=', new Date())
    .orderBy('posts.created_at', 'desc')
    .paginate(request.get().page, 5)

    if(auth.user) {
      // Save request time.
      auth.user.last_global_feed_request = new Date()
      await auth.user.save()
    }

    return posts
  }

  async followings({ request, auth }) {
    const posts = await Post
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
    .join('user_follows', function () {
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
    .whereNull('user_follows.deleted_at')
    .orderBy('posts.created_at', 'desc')
    .paginate(request.get().page, 5)

    if(auth.user) {
      // Save request time.
      auth.user.last_followings_feed_request = new Date()
      await auth.user.save()
    }

    return posts
  }

}

module.exports = FeedController
