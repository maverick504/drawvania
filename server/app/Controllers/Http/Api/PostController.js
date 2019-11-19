'use strict'

const { validateAll } = use('Validator')
const Helpers = use('Helpers')
const Drive = use('Drive')
const Database = use('Database')
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const PostMedia = use('App/Models/PostMedia')
const PostLike = use('App/Models/PostLike')

class PostController {
  async userIndex({ request, params, auth, response }) {
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    var query = Post.query()

    if(auth.user) {
      query
      .select([ 'posts.*' ])
      query
      .select([ 'posts.*', Database.raw("IF((`post_likes`.`id` IS NOT NULL AND `post_likes`.`deleted_at` IS NULL), 1, 0) AS logged_in_user_liked") ])
      .leftJoin('post_likes', function () {
        this
        .on('post_id', 'posts.id')
        .on('user_id', auth.user.id)
      })
    } else {
      query
      .select([ 'posts.*' ])
    }

    return await query
    .with('author')
    .with('media')
    .with('parentPost.author')
    .with('parentPost.media')
    .where('posts.date', '<=', new Date())
    .where('posts.author_id', '=', user.id)
    .orderBy('posts.created_at', 'desc')
    .paginate(request.get().page, 9)
  }

  async store({ request, auth, response }) {
    const rules = {
      description: `string|max:280`,
      restriction: `required|in:no-restriction,moderate-mature-content,strict-mature-content`,
      redrawable: `boolean`,
      parent_post_id: `redrawablePost`
    }

    const { description, restriction, redrawable, parent_post_id } = request.only([ 'description', 'restriction', 'redrawable', 'parent_post_id' ])

    // Validate the fields in the request
    const validation = await validateAll({ description, restriction, redrawable, parent_post_id }, rules)

    if (!validation.fails()) {
      // The file will be moved to a temporal path before being streamed to the cloud
      const file = request.file('file', {
        types: ['jpeg', 'jpg', 'png'],
        size: '5mb'
      })

      if(!file) {
        return response.status(400).json({
          status: 'error',
          message: 'A file is required'
        })
      }

      const tmpFolder = Helpers.tmpPath('uploads')
      const tmpFilename = new Date().valueOf() + '.jpg'
      const tmpPath = tmpFolder + '/' + tmpFilename

      // Try to move the file to a temporal path
      await file.move(tmpFolder, {
        name: tmpFilename,
        overwrite: true
      })

      if (!file.moved()) {
        return response.status(400).json({
          status: 'error',
          message: file.error().message
        })
      }

      // Try to store the create the post and his media.
      const trx = await Database.beginTransaction()

      try {
        // Store the post on database.
        const post = new Post()
        post.author_id = auth.user.id
        post.date = new Date()
        post.description = description
        post.restriction = restriction
        post.redrawable = redrawable === 'true' ? true : false

        var parentPost

        if(parent_post_id) {
          parentPost = await Post.find(parent_post_id)

          post.parent_post_id = parentPost.id
          post.root_post_id = parentPost.root_post_id
        }

        await post.save(trx)

        // Store the post's media. We must store the media item without variations first, because we need an ID.
        const media = new PostMedia()
        media.post_id = post.id
        media.order = 1
        await media.save(trx)

        // Store the image variations the media item on the cloud.
        const stream = Drive.disk('local').getStream(tmpPath)
        await media.storeVariations('media', stream, false)
        media.total_size = media.calculateCollectionSize('media')
        await media.save(trx)

        trx.commit()

        // Count redraws on the parent post.
        if(parent_post_id) {
          await parentPost.countDirectChildrenPosts()
        }

        // Return a success message
        return response.json({
          status: 'success',
          data: post
        })
      } catch(error) {
        trx.rollback()

        return response.status(400).json({
          status: 'error',
          message: 'Something went wrong, please try again.'
        })
      }
    } else {
      response.status(400).send(validation.messages())
    }
  }

  async update({ request, params, auth, response }) {
    // Get the required post
    const post = await Post.findOrFail(params.id)

    // Check if the post if owned by the authenticated user
    if(post.author_id !== auth.user.id) {
      return response.status(400).json({
        status: 'error',
        message: "You cannot modify this post because you are not its author."
      })
    }

    const rules = {
      description: `string|max:280`,
      restriction: `required|in:no-restriction,moderate-mature-content,strict-mature-content`,
      redrawable: `boolean`
    }

    const { description, restriction, redrawable } = request.only([ 'description', 'restriction', 'redrawable' ])

    // Validate the fields in the request
    const validation = await validateAll({ description, restriction, redrawable }, rules)

    if (!validation.fails()) {
      if(post.redrawable && redrawable === false) {
        return response.status(400).json({
          status: 'error',
          message: 'The "redrawable" option cannot be removed after granted.'
        })
      }

      // Update the post's data
      post.description = description
      post.restriction = restriction
      post.redrawable = redrawable
      await post.save()

      // Return a success message
      return response.json({
        status: 'success',
        data: post
      })
    } else {
      response.status(400).send(validation.messages())
    }
  }

  async destroy({ params, auth, response }) {
    // Get the required post
    const post = await Post.findOrFail(params.id)

    // Check if the post if owned by the authenticated user
    if(post.author_id !== auth.user.id) {
      return response.status(400).json({
        status: 'error',
        message: "You cannot delete this post because you are not its author."
      })
    }

    // Delete the post
    await post.delete()

    // Return a success message
    return response.json({
      status: 'success'
    })
  }

  async show({ request, params, auth, response }) {
    var query = Post.query()

    const _with = request.get().with

    // Parse the required relationships from the url params
    if(_with) {
      const relations = _with.split(",")

      // Limit relations
      if(relations.length > 5) {
        return response.status(400).json({
          status: 'error',
          message: 'Too many relations.'
        })
      }

      // Filter relations and keep only valid relations.
      for(var i=0; i<relations.length; i++) {
        if([ 'author', 'media', 'parentPost', 'parentPost.author', 'parentPost.media', 'rootPost', 'rootPost.author', 'rootPost.media' ].includes(relations[i])) {
          query.with(relations[i])
        }
      }
    }

    const post = await query.where('id', '=', params.id).firstOrFail()

    // Check if the authenticated user liked this post
    if(auth.user) {
      post.logged_in_user_liked = await auth.user.likedPost(post.id)
    }

    return post
  }

  async likes({ request, params }) {
    // Check if the post exists
    const post = await Post.findOrFail(params.id)

    // Return likes
    return await PostLike
    .query()
    .with('user')
    .where('post_id', '=', post.id)
    .paginate(request.get().page, 15)
  }

  async like({ params, auth, response }) {
    // Check if the post exists
    const post = await Post.findOrFail(params.id)

    // Check if the post was liked previously.
    const postLike = await PostLike
    .query()
    .withTrashed()
    .where('user_id', '=', auth.user.id)
    .where('post_id', '=', post.id)
    .first()

    // Attach the post
    if(postLike) {
      await postLike.restore()
    } else {
      await auth.user.likedPosts().attach([post.id])
    }

    // Recount likes.
    await post.countLikes()
  }

  async unlike({ params, auth, response }) {
    // Check if the post exists
    const post = await Post.findOrFail(params.id)

    // Detach the post
    await auth.user.likedPosts().detach([post.id])

    // Recount likes.
    await post.countLikes()
  }

  async redraws({ request, params, response }) {
    // Get the required post
    const post = await Post.findOrFail(params.id)

    // Return the children from the post
    return await post
    .childrenPosts()
    .with('author')
    .with('media')
    .with('parentPost.author')
    .with('parentPost.media')
    .paginate(request.get().page, 10)
  }

}

module.exports = PostController
