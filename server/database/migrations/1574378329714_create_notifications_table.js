'use strict'

const Schema = use('Schema')

class NotificationsTableSchema extends Schema {

  up () {
    this.create('notifications', table => {
      table.uuid('id').primary()
      table.integer('triggerer_id').unsigned().nullable()
      table.integer('notifiable_id').unsigned().notNullable()
      table.integer('entity_id').unsigned().nullable()
      table.string('entity_type').nullable()
      table.string('type').notNullable()
      table.json('metadata').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('read_at').nullable()

      table.foreign('triggerer_id').references('id').on('users').onDelete('cascade')
      table.foreign('notifiable_id').references('id').on('users').onDelete('cascade')
    })
  }

  down () {
    this.dropIfExists('notifications')
  }

}

module.exports = NotificationsTableSchema
