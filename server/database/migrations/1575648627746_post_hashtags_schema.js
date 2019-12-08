'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostHashtagsSchema extends Schema {
  up () {
    this.create('post_hashtags', (table) => {
      table.bigIncrements()
      table.bigInteger('post_id').unsigned().notNullable()
      table.bigInteger('hashtag_id').unsigned().notNullable()

      table.foreign('post_id').references('id').on('posts').onDelete('cascade')
      table.foreign('hashtag_id').references('id').on('hashtags').onDelete('cascade')
    })
  }

  down () {
    this.drop('post_hashtags')
  }
}

module.exports = PostHashtagsSchema
