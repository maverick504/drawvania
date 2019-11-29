'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserNotificationSettingsSchema extends Schema {
  up () {
    this.create('notification_settings', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable()
      table.boolean('notify_about_new_like_in_post').notNullable().default(true)
      table.boolean('notify_about_new_like_in_post_comment').notNullable().default(true)
      table.boolean('notify_about_new_redraw_of_post').notNullable().default(true)
      table.boolean('notify_about_new_comment_in_post').notNullable().default(true)
      table.boolean('notify_about_new_reply_to_comment_in_post').notNullable().default(true)
      table.boolean('notify_about_deleted_comment_in_post').notNullable().default(true)
      table.boolean('notify_about_new_follower').notNullable().default(true)
      table.timestamps()

      table.foreign('user_id').references('id').on('users').onDelete('cascade')
    })
  }

  down () {
    this.drop('notification_settings')
  }
}

module.exports = UserNotificationSettingsSchema
