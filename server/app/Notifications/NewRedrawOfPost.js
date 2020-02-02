'use strict'

class NewRedrawOfPost {
  constructor (post) {
    this.entityId = post.id
    this.entityType = 'App/Models/Post'
  }

  type () {
    return 'newRedrawOfPost'
  }

  via () {
    return [ 'database' ]
  }

  metadata () {
    return {}
  }
}

module.exports = NewRedrawOfPost
