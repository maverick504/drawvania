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
      table.boolean('verified_member').notNullable().default(false)
      table.timestamp('verified_at').nullable()
      table.boolean('premium_member').notNullable().default(false)
      table.timestamp('upgraded_premium_at').nullable()
      table.enum('gender', ['male', 'female']).nullable()
      table.string('location').nullable()
      table.text('about').nullable()
      table.json('metadata').nullable()
      table.integer('total_posts').unsigned().default(0)
      table.integer('total_storage_usage').unsigned().default(0) // The sumatory of the storage usage of the posts created by this user.
      table.integer('total_followings').unsigned().default(0)
      table.integer('total_followers').unsigned().default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
