'use strict'

const Hashtag = use('App/Models/Hashtag')

class HashtagController {
  async featured() {
    return await Hashtag
    .query()
    .orderBy('total_users', 'DESC')
    .orderBy('total_posts', 'DESC')
    .limit(5)
    .fetch()
  }

  async tutorial() {
    const hashtags = [
      'AnatomyTutorial', 'AnimalsTutorial', 'BackgroundsTutorial',
      'ColorTutorial', 'ComicsTutorial', 'CompositionTutorial',
      'CostumesTutorial', 'EffectsTutorial', 'FantasyCreaturesTutorial',
      'ItemsTutorial', 'LineartTutorial', 'MangaTutorial',
      'PosesTutorial', 'OtherTutorial'
    ]

    return await Hashtag
    .query()
    .orderBy('total_users', 'DESC')
    .orderBy('total_posts', 'DESC')
    .whereIn('slug', hashtags)
    .fetch()
  }
}

module.exports = HashtagController
