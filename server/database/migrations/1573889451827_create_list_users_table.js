'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListUsersSchema extends Schema {
  up () {
    this.create('list_users', (table) => {
      table.bigIncrements()
      table.integer('list_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()

      table.foreign('list_id').references('id').on('lists').onDelete('cascade')
      table.foreign('user_id').references('id').on('users').onDelete('cascade')
    })
  }

  down () {
    this.drop('list_users')
  }
}

module.exports = ListUsersSchema
