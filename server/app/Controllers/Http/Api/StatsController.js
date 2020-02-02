'use strict'

const Database = use('Database')

class StatsController {

  async index ({ auth }) {
    const totalLikes = await Database.table('post_likes')
    .where('user_id', '=', auth.user.id)
    .whereNull('deleted_at')
    .count()

    const dateToday = new Date()

    const userSkillPoints = await Database.table('skills')
    .select([
      'skills.name AS skill_name',
      'skills.short_name AS skill_short_name',
      'skills.color AS skill_color',
      'user_skills.received_skill_points_count AS received_skill_points'
    ])
    .leftJoin('user_skills', 'skills.id', '=', 'user_skills.skill_id')
    .where((builder) => {
      builder.where('user_skills.user_id', '=', auth.user.id)
      builder.orWhereNull('user_skills.user_id')
    })

    return {
      counters: {
        posts: auth.user.total_posts,
        likes: totalLikes[0]['count(*)'],
        followers: auth.user.total_followers,
        completedChallenges: auth.user.completed_challenges_count,
        receivedSkillPoints: auth.user.received_skill_points_count
      },
      userSkillPoints: userSkillPoints
    }
  }

}

module.exports = StatsController
