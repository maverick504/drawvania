'use strict'

const { validateAll } = use('Validator')
const Database = use('Database')
const Challenge = use('App/Models/Challenge')
const UserCompletedChallenge = use('App/Models/UserCompletedChallenge')
const UserSkill = use('App/Models/UserSkill')

class ChallengeController {

  async index ({ request, auth }) {
    var query = Challenge.query().where('challenges.status', '=', 'published')

    if(auth.user) {
      query.select([
        'challenges.*',
        Database.raw("IF((user_completed_challenges.id IS NOT NULL), 1, 0) AS times_completed")
      ])
      .leftJoin('user_completed_challenges', function () {
        this
        .on('challenge_id', 'challenges.id')
        .on('user_id', auth.user.id)
      })
      .orderBy('times_completed', 'ASC')
    } else {
      query.select([ 'challenges.*' ])
    }

    const skillId = request.get().skill_id

    if(skillId) {
      query.leftJoin('challenge_skill_points', 'challenge_skill_points.challenge_id', '=', 'challenges.id')
      query.where('challenge_skill_points.skill_id', '=', skillId)
    }

    return query.paginate(request.get().page, 5)
  }

  async show ({ request, auth, params }) {
    var query = Challenge.query().where('challenges.status', '=', 'published')

    const _with = request.get().with

    // Parse the required relationships from the url params
    if(_with) {
      const relations = _with.split(",")

      // Limit relations
      if(relations.length > 2) {
        return response.status(400).json({
          status: 'error',
          message: 'Too many relations.'
        })
      }

      // Filter relations and keep only valid relations.
      for(var i=0; i<relations.length; i++) {
        if([ 'skillPoints', 'references' ].includes(relations[i])) {
          query.with(relations[i])
        }
      }
    }

    const challenge = await query.where('id', '=', params.id).firstOrFail()

    // Check if the authenticated user completed this challenge
    if(auth.user) {
      challenge.completed = await await UserCompletedChallenge.query()
      .where('user_id', '=', auth.user.id)
      .where('challenge_id', '=', challenge.id)
      .orderBy('completed_at', 'DESC')
      .first()
    }

    return challenge
  }

  async markAsComplete ({ request, auth, params, response }) {
    const challenge = await Challenge.query()
    .with('skillPoints')
    .where('id', '=', params.id)
    .where('challenges.status', '=', 'published')
    .firstOrFail()

    // Prevent users from doing the same challenge multiple times.
    const timesCompleted = await UserCompletedChallenge.query()
    .where('user_id', '=', auth.user.id)
    .where('challenge_id', '=', challenge.id)
    .count()

    if(timesCompleted[0]['count(*)'] > 0) {
      return response.status(400).send({
        message: 'Challenge already completed!'
      })
    }

    const rules = {
      time_taken: 'required|integer|min:0',
    }

    const { time_taken } = request.only([ 'time_taken' ])

    // Validate the fields in the request
    const validation = await validateAll({ time_taken }, rules)

    if (!validation.fails()) {
      let totalReceivedSkillPoints = 0

      const challengeSkillPoints = challenge.getRelated('skillPoints')

      for(let i in challengeSkillPoints.rows) {
        const skillPoint = challengeSkillPoints.rows[i]
        const skillPointPivot = skillPoint.getRelated('pivot')

        const userSkillRelation = await UserSkill.findOrCreate({
          user_id: auth.user.id,
          skill_id: skillPoint.id
        })

        userSkillRelation.user_id = auth.user.id
        userSkillRelation.skill_id = skillPoint.id
        userSkillRelation.received_skill_points_count = (userSkillRelation.received_skill_points_count || 0) + skillPointPivot.points
        await userSkillRelation.save()

        totalReceivedSkillPoints += skillPointPivot.points
      }

      const completedChallenge = UserCompletedChallenge.create({
        user_id: auth.user.id,
        challenge_id: challenge.id,
        time_taken: time_taken,
        total_received_skill_points: totalReceivedSkillPoints,
        completed_at: new Date()
      })

      auth.user.completed_challenges_count ++
      auth.user.received_skill_points_count += totalReceivedSkillPoints
      await auth.user.save()

      return completedChallenge
    } else {
      response.status(400).send(validation.messages())
    }
  }

}

module.exports = ChallengeController
