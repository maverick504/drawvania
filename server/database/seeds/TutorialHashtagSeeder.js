'use strict'

/*
|--------------------------------------------------------------------------
| TutorialHashtagSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database')

class TutorialHashtagSeeder {
  async run () {
    const tutorialHashtags = [
      'AnatomyTutorial', 'AnimalsTutorial', 'BackgroundsTutorial',
      'ColorTutorial', 'ComicsTutorial', 'CompositionTutorial',
      'CostumesTutorial', 'EffectsTutorial', 'FantasyCreaturesTutorial',
      'ItemsTutorial', 'LineartTutorial', 'MangaTutorial',
      'PosesTutorial', 'OtherTutorial'
    ]

    for(let i=0; i<tutorialHashtags.length; i++) {
      const hahstag = tutorialHashtags[i]
      await Database.table('hashtags').insert({
        slug: hahstag
      })
    }
  }
}

module.exports = TutorialHashtagSeeder
