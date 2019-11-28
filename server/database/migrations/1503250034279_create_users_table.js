'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.json('avatar').nullable()
      table.string('username', 80).notNullable().unique().index()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamp('verified_at').nullable()
      table.timestamp('upgraded_premium_at').nullable()
      table.enum('gender', ['male', 'female']).nullable()
      table.string('location').nullable()
      table.text('about').nullable()
      table.timestamp('last_global_feed_request').nullable()
      table.timestamp('last_followings_feed_request').nullable()
      table.timestamp('last_notifications_request').nullable()
      table.integer('total_posts').notNullable().unsigned().default(0)
      table.integer('total_storage_usage').notNullable().unsigned().default(0) // The sumatory of the storage usage of the posts created by this user.
      table.integer('total_followings').notNullable().unsigned().default(0)
      table.integer('total_followers').notNullable().unsigned().default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
