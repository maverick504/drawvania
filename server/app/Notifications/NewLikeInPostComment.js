'use strict'

class NewLikeInPostComment {
  constructor (comment) {
    this.entityId = comment.id
    this.entityType = 'App/Models/PostComment'
  }

  type () {
    return 'newLikeInPostComment'
  }

  via () {
    return [ 'database' ]
  }

  metadata () {
    return {}
  }
}

module.exports = NewLikeInPostComment
