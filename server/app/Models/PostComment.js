'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class PostComment extends Model {
  static boot () {
    super.boot()

    /**
     * Recount comments on post and parent comment after the post is created.
     */
    this.addHook('afterCreate', async (commentInstance) => {
      const post = await commentInstance.post().first()
      await post.countComments()

      if(commentInstance.parent_comment_id) {
        const parentComment = await commentInstance.parentComment().first()
        parentComment.countReplies()
      }
    })

    /**
     * Recount comments on post and parent comment after the post is deleted.
     */
    this.addHook('afterDelete', async (commentInstance) => {
      const post = await commentInstance.post().first()
      await post.countComments()

      if(commentInstance.parent_comment_id) {
        const parentComment = await commentInstance.parentComment().first()
        parentComment.countReplies()
      }
    })
  }

  static get createdAtColumn () {
    return 'created_at'
  }

  static get updatedAtColumn () {
    return null
  }

  async countLikes () {
    const query = await this.likers().count()
    this.total_likes = query[0]['count(*)'] || 0

    await this.save()
  }

  async countReplies () {
    const query = await this.replies().count()
    this.total_replies = query[0]['count(*)'] || 0

    await this.save()
  }

  static scopeWithLikes (query, userId) {
    return query
    .select([
      'post_comments.*',
      Database.raw("IF((`post_comment_likes`.`id` IS NOT NULL AND `post_comment_likes`.`deleted_at` IS NULL), 1, 0) AS logged_in_user_liked")
    ])
    .leftJoin('post_comment_likes', function () {
      this
      .on('comment_id', 'post_comments.id')
      .on('user_id', userId)
    })
  }

  author () {
    return this.belongsTo('App/Models/User', 'author_id', 'id')
  }

  post () {
    return this.belongsTo('App/Models/Post')
  }

  parentComment () {
    return this.belongsTo('App/Models/PostComment', 'parent_comment_id', 'id')
  }

  likers () {
    return this.belongsToMany('App/Models/User', 'comment_id', 'user_id')
    .pivotModel('App/Models/PostCommentLike')
  }

  replies () {
    return this.hasMany('App/Models/PostComment', 'id', 'parent_comment_id')
  }
}

module.exports = PostComment
