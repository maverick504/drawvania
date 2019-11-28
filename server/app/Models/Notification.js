'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const uuid = require('uuid/v4')

class Notification extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:CastAttributes')

    this.addHook('beforeCreate', async (notificationInstance) => {
      notificationInstance.id = uuid()
    })
  }

  /**
   * add values to cast to upon set
   */
  static get casts () {
    return {
      metadata: 'json'
    }
  }

  static get createdAtColumn () {
    return 'created_at'
  }

  static get updatedAtColumn () {
    return null
  }

  triggerer () {
    return this.hasOne('App/Models/User', 'triggerer_id', 'id')
  }

  notifiable () {
    return this.hasOne('App/Models/User', 'notifiable_id', 'id')
  }

  entity () {
    if(this.entity_type === 'App/Models/PostComment') {
      return this.belongsTo('App/Models/PostComment', 'entity_id', 'id')
    } else if(this.entity_type === 'App/Models/Post') {
      return this.belongsTo('App/Models/Post', 'entity_id', 'id')
    } else {
      return this.belongsTo('App/Models/Post', 'entity_id', 'id').whereRaw('true = false')
    }
  }
}

module.exports = Notification
