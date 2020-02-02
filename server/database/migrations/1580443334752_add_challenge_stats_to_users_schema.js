'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddChallengeStatsToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.integer('completed_challenges_count').notNullable().unsigned().default(0)
      table.integer('received_skill_points_count').notNullable().unsigned().default(0)
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('completed_challenges_count')
      table.dropColumn('received_skill_points_count')
    })
  }
}

module.exports = AddChallengeStatsToUsersSchema
