'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListSubscribersSchema extends Schema {
  up () {
    this.create('list_subscribers', (table) => {
      table.increments()
      table.integer('list_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.timestamp('updated_at').notNullable()
      table.timestamp('deleted_at').nullable()

      table.foreign('list_id').references('id').on('lists').onDelete('cascade')
      table.foreign('user_id').references('id').on('users').onDelete('cascade')
    })
  }

  down () {
    this.drop('list_subscribers')
  }
}

module.exports = ListSubscribersSchema
