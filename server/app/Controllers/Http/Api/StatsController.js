'use strict'

const Database = use('Database')

class StatsController {

  async index ({ auth }) {
    const totalLikes = await Database.table('post_likes')
    .leftJoin('posts', 'posts.id', '=', 'post_likes.post_id')
    .where('posts.author_id', '=', auth.user.id)
    .whereNull('post_likes.deleted_at')
    .count('post_likes.id')

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
        createdPosts: auth.user.total_posts,
        receivedLikes: totalLikes[0]['count(`post_likes`.`id`)'],
        followers: auth.user.total_followers,
        completedChallenges: auth.user.completed_challenges_count,
        receivedSkillPoints: auth.user.received_skill_points_count
      },
      userSkillPoints: userSkillPoints
    }
  }

}

module.exports = StatsController
