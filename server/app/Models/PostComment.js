'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

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

  async countReplies () {
    const query = await this.replies().count()
    this.total_replies = query[0]['count(*)']

    await this.save()
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

  replies () {
    return this.hasMany('App/Models/PostComment', 'id', 'parent_comment_id')
  }
}

module.exports = PostComment
