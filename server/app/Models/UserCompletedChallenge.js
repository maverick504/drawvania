'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserCompletedChallenge extends Model {
  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  challenge () {
    return this.belongsTo('App/Models/Challenge')
  }
}

module.exports = UserCompletedChallenge
