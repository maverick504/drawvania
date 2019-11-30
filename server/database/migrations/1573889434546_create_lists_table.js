'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListsSchema extends Schema {
  up () {
    this.create('lists', (table) => {
      table.increments()
      table.integer('author_id').unsigned().notNullable()
      table.string('name', 45).nullable()
      table.string('description', 280).nullable()
      table.timestamps()

      table.foreign('author_id').references('id').on('users').onDelete('cascade')
    })
  }

  down () {
    this.drop('lists')
  }
}

module.exports = ListsSchema
