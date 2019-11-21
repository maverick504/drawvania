'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostMediaSchema extends Schema {
  up () {
    this.create('post_media', (table) => {
      table.bigIncrements()
      table.bigInteger('post_id').unsigned().nullable()
      table.integer('order').unsigned().nullable()
      table.json('variations').nullable()
      table.integer('total_storage_usage').unsigned().default(0) // The size of all the media variations.
      table.timestamps()

      table.foreign('post_id').references('id').on('posts').onDelete('cascade')
    })
  }

  down () {
    this.drop('post_media')
  }
}

module.exports = PostMediaSchema
