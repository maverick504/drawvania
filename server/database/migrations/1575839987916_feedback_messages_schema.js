'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FeedbackMessagesSchema extends Schema {
  up () {
    this.create('feedback_messages', (table) => {
      table.bigIncrements()
      table.integer('author_id').unsigned().nullable()
      table.enum('type', [
        'suggestion',
        'bug-report',
        'feature-request',
        'translation-error',
        'other'
      ]).nullable()
      table.string('details', 500).nullable()
      table.string('origin_url', 2083).nullable()
      table.json('metadata').nullable() // Screen size, device type, etc.
      table.timestamp('created_at')

      table.foreign('author_id').references('id').on('users').onDelete('cascade')
    })
  }

  down () {
    this.drop('feedback_messages')
  }
}

module.exports = FeedbackMessagesSchema
