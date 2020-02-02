'use strict'

const Database = use('Database')
const Post = use('App/Models/Post')

class PremiumController {

  async index ({ view }) {
    const randomPost = await Post.query()
    .with('media')
    .orderBy(Database.raw('RAND()'))
    .first()

    const variations = JSON.parse(randomPost.getRelated('media').rows[0]['variations'])
    const heroImage = variations['1280w']['url']

    return view.render('premium.landing', {
      heroImage: heroImage
    })
  }

}

module.exports = PremiumController
