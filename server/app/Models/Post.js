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
      // Count posts on the author.
      const author = await postInstance.author().first()
      await author.countPosts()

      // Count redraws on the parent post.
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
      logged_in_user_liked: 'boolean',
      logged_in_user_is_follower: 'boolean'
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

  async countComments () {
    const query = await this.comments().count()
    const total = query[0]['count(*)']

    this.total_comments = total

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

  comments () {
    return this.hasMany('App/Models/PostComment')
  }
}

module.exports = Post
