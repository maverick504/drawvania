'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:Adonis/Acl/HasRole')
    this.addTrait('@provider:Adonis/Acl/HasPermission')
    this.addTrait('@provider:CastAttributes')
    this.addTrait('HasMedia', {
      modelFolderName: 'users',
      collections: {
        avatar: {
          columnName: 'avatar',
          variations: {
            'small': { width: 50, height: 50 },
            'large': { width: 300, height: 300 }
          }
        }
      }
    })

    /**
     * A hook to hash the password before creating the user
     * it to the database.
     */
    this.addHook('beforeCreate', async (userInstance) => {
      userInstance.password = await Hash.make(userInstance.password)
    })
  }

  /**
   * add values to cast to upon set
   */
  static get casts () {
    return {
      avatar: 'json'
    }
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  /**
   * Hide password when user is fetched.
   */
  static get hidden () {
    return ['password']
  }

  async countPosts () {
    const query = await this.posts().count()
    this.total_posts = query[0]['count(*)']

    await this.save()
  }

  async countFollowings () {
    const query = await this.followings().count()
    this.total_followings = query[0]['count(*)']

    await this.save()
  }

  async countFollowers () {
    const query = await this.followers().count()
    this.total_followers = query[0]['count(*)']

    await this.save()
  }

  async likedPost (id) {
    const post = await this.likedPosts().where('post_id', '=', id).first()
    return post ? true : false
  }

  async following (id) {
    const user = await this.followings().where('followed_id', '=', id).first()
    return user ? true : false
  }

  posts () {
    return this.hasMany('App/Models/Post', 'id', 'author_id')
  }

  likedPosts () {
    return this.belongsToMany('App/Models/Post')
    .pivotModel('App/Models/PostLike')
  }

  followers () {
    return this.belongsToMany('App/Models/User', 'followed_id', 'follower_id', 'id', 'id')
    .pivotModel('App/Models/UserFollowing')
  }

  followings () {
    return this.belongsToMany('App/Models/User', 'follower_id', 'followed_id', 'id', 'id')
    .pivotModel('App/Models/UserFollowing')
  }
}

module.exports = User
