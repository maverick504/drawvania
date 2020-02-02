'use strict'

const { validateAll } = use('Validator')
const UserCompletedChallenge = use('App/Models/UserCompletedChallenge')

class UserCompletedChallengeController {

  async show ({ request, auth, params }) {
    var query = auth.user.completedChallenges()

    const _with = request.get().with

    // Parse the required relationships from the url params
    if(_with) {
      const relations = _with.split(",")

      // Limit relations
      if(relations.length > 5) {
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

    return await query.where('user_completed_challenges.id', '=', params.id).firstOrFail()
  }

}

module.exports = UserCompletedChallengeController
