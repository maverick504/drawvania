'use strict'

const Config = use('Config')
const Drive = use('Drive')
const stream = require('stream')
const sharp = require('sharp')

class HasMedia {
  register (Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)

    Model.prototype.storeVariations = async function (collectionName, stream, save = true) {
      const collection = options.collections[collectionName]
      const variationNames = Object.keys(collection.variations)

      // Delete all the previous variations for this collection in this model.
      await Drive.disk('spaces').delete(`${options.modelFolderName}/${this.id}/${collectionName}/`)

      // Store all the variations for the new file.
      var variationsObject = {}
      await Promise.all(
        variationNames.map(
          (variationName) => this.storeVariation(variationsObject, stream, collectionName, variationName)
        )
      )

      // Set the stored variations data to the model.
      this[collection.columnName] = variationsObject

      if(save) {
        // Update the model.
        await this.save()
      }

      return variationsObject
    }

    Model.prototype.storeVariation = async function (variationsObject, stream, collectionName, variationName) {
      const collection = options.collections[collectionName]
      const variation = collection.variations[variationName]

      // Generate a unique filename. That's because most browsers cache the files by
      // filename and will display the cached image if we don't make a unique name.
      const hash  = new Date().valueOf()
      const path = `${options.modelFolderName}/${this.id}/${collectionName}/${hash}-${variationName}.jpg`
      const url = Config.get('drive.disks.spaces.endpoint') + '/' + Config.get('drive.disks.spaces.bucket') + '/' + path

      // If width is defined but not the height, the height will be calculated to keep
      // aspect ratio, and viceversa.
      // Is both width and height are defined, the image will be cropped.
      var resizeOptions = {}
      if (variation.width !== null) { resizeOptions.width = variation.width }
      if (variation.height !== null) { resizeOptions.height = variation.height }

      // Resize the image.
      const transform = sharp().resize(resizeOptions).jpeg({ quality: 90 }).toFormat('jpg')
      stream.pipe(transform)
      const output = await transform.toBuffer()

      // Save the image on the drive.
      await Drive.disk('spaces').put(path, output, {
        ACL: 'public-read',
        ContentType: 'image/jpg'
      })

      // Get image metadata
      const metadata = await sharp(output).metadata()

      variationsObject[variationName] = {
        driver: 'spaces',
        path: path,
        url: url,
        width: metadata.width,
        height: metadata.height,
        size: metadata.size
      }
    }

    Model.prototype.deleteVariations = async function (collectionName) {
      // Delete all the previous variations for this collection in this model.
      await Drive.disk('spaces').delete(`${options.modelFolderName}/${this.id}/${collectionName}/`)
    }

    /*
     * Returns the sumatory of the sizes of the specified collection.
     */
    Model.prototype.calculateCollectionSize = function (collectionName) {
      return 999
    }
  }
}

module.exports = HasMedia
