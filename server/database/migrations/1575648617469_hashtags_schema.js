'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HashagsSchema extends Schema {
  up () {
    this.create('hashtags', (table) => {
      table.bigIncrements()
      table.string('slug').notNullable().unique().index()
      table.integer('total_posts').notNullable().unsigned().default(0)
      table.integer('total_users').notNullable().unsigned().default(0)
      table.timestamp('created_at').notNullable()
    })
  }

  down () {
    this.drop('hashtags')
  }
}

module.exports = HashagsSchema
