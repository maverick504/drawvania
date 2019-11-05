'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Post extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:CastAttributes')

    /*
     * Note: we aren't using an aftterCreate hook because we are using
     * transactions on the post creation's method, and transaction makes
     * that countDirectChildrenPosts doesn't count the post that is
     * being created in the transaction.
     */

     /**
      * Recount childrens on the parent post after the post is deleted.
      */
    this.addHook('afterDelete', async (postInstance) => {
      if(postInstance.parent_post_id) {
        const parentPost = await postInstance.parentPost().first()
        await parentPost.countDirectChildrenPosts()
      }
    })
  }

  /**
   * add values to cast to upon set
   */
  static get casts () {
    return {
      redrawable: 'boolean',
      user_liked: 'boolean'
    }
  }

  static get dates() {
    return super.dates.concat([ 'date' ])
  }

  async countLikes () {
    const query = await this.likers().count()
    this.total_likes = query[0]['count(*)']

    await this.save()
  }

  async countDirectChildrenPosts () {
    const query = await this.childrenPosts().count()
    const total = query[0]['count(*)']

    this.total_direct_children_posts = total

    await this.save()
  }

  author () {
    return this.belongsTo('App/Models/User', 'author_id', 'id')
  }

  parentPost () {
    return this.belongsTo('App/Models/Post', 'parent_post_id', 'id')
  }

  rootPost() {
    return this.belongsTo('App/Models/Post', 'root_post_id', 'id')
  }

  childrenPosts () {
    return this.hasMany('App/Models/Post', 'id', 'parent_post_id')
  }

  media () {
    return this.hasMany('App/Models/PostMedia')
  }

  likers () {
    return this.belongsToMany('App/Models/User')
    .pivotModel('App/Models/PostLike')
  }
}

module.exports = Post
