'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PostCommentLike extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return 'updated_at'
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  postComment () {
    return this.belongsTo('App/Models/PostComment', 'id', 'comment_id')
  }
}

module.exports = PostCommentLike
