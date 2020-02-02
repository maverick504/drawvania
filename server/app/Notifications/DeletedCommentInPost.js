'use strict'

class DeletedCommentInPost {
  constructor (post, comment) {
    this.comment = comment

    this.entityId = post.id
    this.entityType = 'App/Models/PostComment'
  }

  type () {
    return 'deletedCommentInPost'
  }

  via () {
    return [ 'database' ]
  }

  metadata () {
    return {
      comment: {
        id: this.comment.id,
        comment: this.comment.comment
      }
    }
  }
}

module.exports = DeletedCommentInPost
