'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class Hashtag extends Model {
  static get createdAtColumn () {
    return 'created_at'
  }

  static get updatedAtColumn () {
    return null
  }

  async countPostsAndUsers () {
    const queryResult = await Database
    .table('posts')
    .select([
      Database.raw("COUNT(DISTINCT `posts`.`id`) AS total_posts"),
      Database.raw("COUNT(DISTINCT `posts`.`author_id`) AS total_users")
    ])
    .leftJoin('post_hashtags', 'posts.id', 'post_hashtags.post_id')
    .where('post_hashtags.hashtag_id', '=', this.id)

    this.total_posts = queryResult[0]['total_posts'] || 0
    this.total_users = queryResult[0]['total_users'] || 0

    await this.save()
  }

  posts () {
    return this.belongsToMany('App/Models/Post')
    .pivotModel('App/Models/PostHashtag')
  }
}

module.exports = Hashtag
