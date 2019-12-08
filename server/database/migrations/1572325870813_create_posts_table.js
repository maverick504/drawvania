'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.bigIncrements()
      table.integer('author_id').unsigned().notNullable()
      table.bigInteger('parent_post_id').unsigned().nullable() // Posts have a parent_post_id if it is a redraw of another post.
      table.bigInteger('root_post_id').unsigned().nullable() // Like parent_post_id, but this is the root parent post.
      table.timestamp('date').notNullable()
      table.string('description', 280).nullable()
      table.enum('restriction', ['no-restriction', 'moderate-mature-content', 'strict-mature-content']).nullable()
      table.boolean('redrawable').notNullable().default(false)
      table.integer('total_media').notNullable().unsigned().default(0)
      table.integer('total_storage_usage').notNullable().unsigned().default(0) // The sumatory of the storage usage of all the media associated to this post.
      table.integer('total_hashtags').notNullable().unsigned().default(0)
      table.integer('total_likes').notNullable().unsigned().default(0)
      table.integer('total_comments').notNullable().unsigned().default(0)
      table.integer('total_direct_children_posts').notNullable().unsigned().default(0)
      table.timestamps()

      table.foreign('author_id').references('id').on('users').onDelete('cascade')
      table.foreign('parent_post_id').references('id').on('posts').onDelete('set null')
      table.foreign('root_post_id').references('id').on('posts').onDelete('set null')
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
