'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PostHashtag extends Model {
  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

  post () {
    return this.belongsTo('App/Models/Post')
  }

  hashtag () {
    return this.belongsTo('App/Models/Hashtag')
  }
}

module.exports = PostHashtag
