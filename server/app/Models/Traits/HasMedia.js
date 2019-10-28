'use strict'

const Config = use('Config')
const Drive = use('Drive')
const stream = require('stream')
const sharp = require('sharp')

class HasMedia {
  register (Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)

    Model.prototype.setMedia = async function (file, collectionName) {
      const collection = options.collections[collectionName]
      const variationNames = Object.keys(collection.variations)

      // Delete all the previous variations for this collection in this model
      await Drive.disk('spaces').delete(`${options.modelFolderName}/${this.id}/${collectionName}/`)

      // Store all the variations for the new file.
      const storedVariations = await Promise.all(
        variationNames.map(
          (variationName) => this.storeVariation(file, collectionName, variationName)
        )
      )

      // Update the model.
      this[collection.columnName] = storedVariations
      await this.save()
    }

    Model.prototype.storeVariation = async function (file, collectionName, variationName) {
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
      var transform = await sharp().resize(resizeOptions).jpeg({ quality: 90 }).toFormat('jpg')

      // Pipe the file
      const data = file.stream.pipe(transform)

      // Get image metadata
      const buffer = await transform.toBuffer()
      const metadata = await sharp(buffer).metadata()

      // Save the image on the file system.
      await Drive.disk('spaces').put(path, data, {
        ACL: 'public-read',
        ContentType: 'image/jpg'
      })

      return {
        driver: 'spaces',
        path: path,
        url: url,
        width: metadata.width,
        height: metadata.height,
        size: metadata.size
      }
    }
  }
}

module.exports = HasMedia
