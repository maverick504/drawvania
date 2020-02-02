'use strict'

class NewReplyToCommentInPost {
  constructor (parentComment, comment) {
    this.comment = comment

    this.entityId = parentComment.id
    this.entityType = 'App/Models/PostComment'
  }

  type () {
    return 'newReplyToCommentInPost'
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

module.exports = NewReplyToCommentInPost
