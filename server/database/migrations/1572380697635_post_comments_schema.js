'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostCommentsSchema extends Schema {
  up () {
    this.create('post_comments', (table) => {
      table.bigIncrements()
      table.integer('author_id').unsigned().notNullable()
      table.bigInteger('post_id').unsigned().notNullable()
      table.bigInteger('parent_comment_id').unsigned().nullable() // If the comment has a commend_id, then it is a response.
      table.text('comment')
      table.integer('total_replies').unsigned().default(0)
      table.timestamps()
      table.timestamp('deleted_at').nullable()

      table.foreign('author_id').references('id').on('users').onDelete('cascade')
      table.foreign('post_id').references('id').on('posts').onDelete('cascade')
      table.foreign('parent_comment_id').references('id').on('post_comments').onDelete('cascade')
    })
  }

  down () {
    this.drop('post_comments')
  }
}

module.exports = PostCommentsSchema
