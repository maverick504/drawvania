'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserCompletedChallengesSchema extends Schema {
  up () {
    this.create('user_completed_challenges', (table) => {
      table.increments()
      table.integer('user_id').notNullable().unsigned()
      table.bigInteger('challenge_id').notNullable().unsigned()
      table.bigInteger('post_id').nullable().unsigned()
      table.integer('time_taken').notNullable().unsigned()
      table.integer('total_received_skill_points').notNullable().unsigned()
      table.timestamp('completed_at').notNullable()

      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.foreign('challenge_id').references('id').on('challenges').onDelete('cascade')
      table.foreign('post_id').references('id').on('posts').onDelete('set null')
    })
  }

  down () {
    this.drop('user_completed_challenges')
  }
}

module.exports = UserCompletedChallengesSchema
