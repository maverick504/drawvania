'use strict'

class NewLikeInPost {
  constructor (post) {
    this.entityId = post.id
    this.entityType = 'App/Models/Post'
  }

  type () {
    return 'newLikeInPost'
  }

  via () {
    return [ 'database' ]
  }

  metadata () {
    return {}
  }
}

module.exports = NewLikeInPost
