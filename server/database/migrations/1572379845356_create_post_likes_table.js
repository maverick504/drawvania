'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostLikesSchema extends Schema {
  up () {
    this.create('post_likes', (table) => {
      table.bigIncrements()
      table.integer('user_id').unsigned().notNullable()
      table.bigInteger('post_id').unsigned().notNullable()
      table.timestamp('updated_at').notNullable()
      table.timestamp('deleted_at').nullable()

      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.foreign('post_id').references('id').on('posts').onDelete('cascade')
    })
  }

  down () {
    this.drop('post_likes')
  }
}

module.exports = PostLikesSchema
