'use strict'

const Database = use('Database')
const Post = use('App/Models/Post')

class FeedController {

  async global({ request, auth, response }) {
    var query = Post.query()

    if(auth.user) {
      query
      .select([ 'posts.*' ])
      query
      .select([ 'posts.*', Database.raw("IF((`post_likes`.`id` IS NOT NULL AND `post_likes`.`deleted_at` IS NULL), 1, 0) AS user_liked") ])
      .leftJoin('post_likes', function () {
        this
        .on('post_id', 'posts.id')
        .on('user_id', auth.user.id)
      })
    } else {
      query
      .select([ 'posts.*' ])
    }

    return await query
    .with('author')
    .with('media')
    .with('parentPost.author')
    .with('parentPost.media')
    .where('date', '<=', new Date())
    .orderBy('created_at', 'desc')
    .paginate(request.get().page, 5)
  }

}

module.exports = FeedController
