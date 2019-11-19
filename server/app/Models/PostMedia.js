'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PostMedia extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:CastAttributes')
    this.addTrait('HasMedia', {
      modelFolderName: 'post_media',
      collections: {
        media: {
          columnName: 'variations',
          variations: {
            '900w': { width: 900 },
            '600w': { width: 600 },
            '300w': { width: 300 },
            '300x300': { width: 300, height: 300 },
            '100x100': { width: 100, height: 100 },
            '50x50': { width: 50, height: 50 }
          }
        }
      }
    })

    /**
     * A hook to delete the files on the file system before
     * deleting the row from the database.
     */
    this.addHook('beforeDelete', async (postMediaInstance) => {
      await postMediaInstance.deleteVariations()
    })
  }

  static get table () {
    return 'post_media'
  }

  /**
   * add values to cast to upon set
   */
  static get casts () {
    return {
      variations: 'json'
    }
  }

  post () {
    return this.belongsTo('App/Models/Post')
  }
}

module.exports = PostMedia
