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
            '50X50': { width: 50, height: 50 },
            '300x300': { width: 300, height: 300 }
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
      avatar: 'json',
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
}

module.exports = User
