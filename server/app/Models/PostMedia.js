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
            '1280w': { width: 1280, force: false },
            '640wf': { width: 640, force: true },
            '300x300f': { width: 300, height: 300, force: true },
            '100x100f': { width: 100, height: 100, force: true },
            '50x50f': { width: 50, height: 50, force: true }
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
