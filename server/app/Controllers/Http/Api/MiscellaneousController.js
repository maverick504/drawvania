'use strict'

const Database = use('Database')
const Post = use('App/Models/Post')

class MiscellaneousController {

  async weeklyRanking() {
    return Post
    .query()
    .with('author')
    .with('media')
    .where(Database.raw("YEARWEEK(`created_at`, 1)"), '=', Database.raw("YEARWEEK(CURDATE(), 1)"))
    .orderBy('total_likes', 'desc')
    .limit(5)
    .fetch()
  }

}

module.exports = MiscellaneousController
