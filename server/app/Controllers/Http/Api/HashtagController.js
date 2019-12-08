'use strict'

const Hashtag = use('App/Models/Hashtag')

class HashtagController {
  async featured() {
    return await Hashtag
    .query()
    .orderBy('total_users', 'DESC')
    .orderBy('total_posts', 'DESC')
    .limit(5)
    .fetch()
  }
}

module.exports = HashtagController
