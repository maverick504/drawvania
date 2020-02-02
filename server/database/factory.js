'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', async (faker) => {
  return {
    username: faker.username(),
    email: faker.email(),
    password: await Hash.make('password')
  }
})

const difficultyLevels = [ 'beginner', 'medium', 'advanced' ]
const commonTimeEstimations = [ 5, 10, 15, 30, 45, 60 ]

Factory.blueprint('App/Models/Challenge', (faker) => {
  return {
    title: faker.sentence(),
    difficulty_level: difficultyLevels[Math.floor(Math.random()*difficultyLevels.length)],
    estimated_time: commonTimeEstimations[Math.floor(Math.random()*commonTimeEstimations.length)],
    body: faker.paragraph(),
    status: 'published'
  }
})
