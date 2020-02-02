'use strict'

class NewFollower {
  constructor (follower) {
    this.entityId = null
    this.entityType = null
  }

  type () {
    return 'newFollower'
  }

  via () {
    return [ 'database' ]
  }

  metadata () {
    return {}
  }
}

module.exports = NewFollower
