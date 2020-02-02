'use strict'

const { validateAll } = use('Validator')
const Config = use('Config')
const Helpers = use('Helpers')
const Drive = use('Drive')
const Database = use('Database')
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const UserCompletedChallenge = use('App/Models/UserCompletedChallenge')
const PostMedia = use('App/Models/PostMedia')
const Hashtag = use('App/Models/Hashtag')
const PostLike = use('App/Models/PostLike')
const NotificationSender = use('App/Utils/NotificationSender')
const NewRedrawOfPost = use('App/Notifications/NewRedrawOfPost')
const NewLikeInPost = use('App/Notifications/NewLikeInPost')

class PostController {

  async userIndex({ request, params, auth }) {
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    var query = Post.query()

    if(auth.user) {
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

  async hashtagIndex({ request, params, auth }) {
    const hashtag = await Hashtag.findByOrFail('slug', params.slug)

    var query = Post
    .query()
    .leftJoin('post_hashtags', 'posts.id', 'post_hashtags.post_id')
    .where('post_hashtags.hashtag_id', '=', hashtag.id)

    if(auth.user) {
      query
      .select([
        'posts.*',
        Database.raw("IF((`post_likes`.`id` IS NOT NULL AND `post_likes`.`deleted_at` IS NULL), 1, 0) AS logged_in_user_liked")
      ])
      .leftJoin('post_likes', function () {
        this
        .on('post_likes.post_id', 'posts.id')
        .on('post_likes.user_id', auth.user.id)
      })
      .with('author', (builder) => {
        builder
        .select([
          'users.*',
          Database.raw("IF((`user_follows`.`id` IS NOT NULL AND `user_follows`.`deleted_at` IS NULL), 1, 0) AS logged_in_user_is_follower")
        ])
        .leftJoin('user_follows', function () {
          this.on('user_follows.followed_id', 'users.id')
          this.on('user_follows.follower_id', auth.user.id)
        })
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
    .orderBy('posts.created_at', 'desc')
    .paginate(request.get().page, 9)
  }

  async store({ request, auth, response }) {
    if(auth.user.total_storage_usage > Config.get('drawvania.maximumStorage.common')) {
      return response.status(400).json({
        status: 'error',
        message: 'Maximum storage usage for this account has been exceeded.'
      })
    }

    const latestPost = await auth.user.posts()
    .orderBy('date', 'DESC')
    .firstOrFail()

    // Once you create a post, you must wait 30 minutes to create the next one.
    const minimumPostTimeDiference = 30

    // Calculate minutes since last post created.
    const diff = Math.floor((new Date() - new Date(latestPost.created_at)) / 1000 / 60)

    if(diff < minimumPostTimeDiference) {
      return response.status(400).json({
        status: 'error',
        message: `You must wait ${minimumPostTimeDiference-diff} minutes before posting again.`
      })
    }

    const rules = {
      description: `string|max:280|maxHashtags:10`,
      restriction: `required|in:no-restriction,moderate-mature-content,strict-mature-content`,
      redrawable: `boolean`,
      parent_post_id: `redrawablePost`,
      completed_challenge_id: `validCompletedChallengeRelationship:${auth.user.id}`
    }

    const { description, restriction, redrawable, parent_post_id, completed_challenge_id } = request.only([ 'description', 'restriction', 'redrawable', 'parent_post_id', 'completed_challenge_id' ])

    // Validate the fields in the request
    const validation = await validateAll({ description, restriction, redrawable, parent_post_id, completed_challenge_id }, rules)

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
        var completedChallenge

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
        media.total_storage_usage = media.calculateCollectionStorageUsage('media')
        await media.save(trx)

        // Update the posts's total media items and total storage usage.
        post.total_media = 1
        post.total_storage_usage = media.total_storage_usage
        await post.save(trx)

        // Relate the post with a completed challenge.
        if(completed_challenge_id) {
          const completedRelationship = await UserCompletedChallenge.query()
          .where('id', '=', completed_challenge_id)
          .where('user_id', '=', auth.user.id)
          .first()

          completedRelationship.post_id = post.id
          await completedRelationship.save(trx)
        }

        const tags = []

        trx.commit()

        // Syncronize hashtags
        await this.syncHashtags(post)

        if(parent_post_id && (auth.user.id !== parentPost.author_id)) {
          const parentPostAuthor = await parentPost.author().first()

          // Notify the parent post's author.
          await NotificationSender.send(auth.user, parentPostAuthor, new NewRedrawOfPost(parentPost))
        }

        // Count posts on the author.
        await auth.user.countPostsAndStorageUsage()

        if(parent_post_id) {
          // Count redraws on the parent post.
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
      description: `string|max:280|maxHashtags:10`,
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
      post.updated_at = new Date()
      await post.save()

      // Syncronize hashtags
      await this.syncHashtags(post)

      // Return a success message
      return response.json({
        status: 'success',
        data: post
      })
    } else {
      response.status(400).send(validation.messages())
    }
  }

  async syncHashtags(post) {
    const oldHashtags = await post.hashtags().fetch()
    const oldHashtagsIds = oldHashtags.rows.map(function(hashtag) {
      return hashtag.id
    })

    var newHashtagsIds = []

    // Match hashtags on the post's description.
    const matchedHashtags = post.description.match(/#[a-z][a-z0-9]*(?=\s|$)/gi) || []

    // Find or create the hashtags and make an array with their ids.
    for(let i=0; i<matchedHashtags.length; i++) {
      const slug = matchedHashtags[i].substr(1) // Remove the '#' (hash) from the start.

      const hashtag = await Hashtag.findOrCreate({
        slug: slug
      })

      newHashtagsIds.push(hashtag.id)
    }

    // Attach the new hashtags to the post and detach the removed hashtags.
    await post.hashtags().sync(newHashtagsIds)

    const hashtagsIds = oldHashtagsIds.concat(newHashtagsIds)
    for(let i=0; i<hashtagsIds.length; i++) {
      const hashtagId = hashtagsIds[i]

      // If the hashtag has been added or removed, recount posts and users from it.
      const hashtagRemained = newHashtagsIds.includes(hashtagId) && oldHashtagsIds.includes(hashtagId)
      if(hashtagRemained === false) {
        const hashtag = await Hashtag.find(hashtagId)
        await hashtag.countPostsAndUsers()
      }
    }

    // Save the total of used hashtags by the post.
    post.total_hashtags = newHashtagsIds.length
    await post.save()
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
      if(relations.length > 6) {
        return response.status(400).json({
          status: 'error',
          message: 'Too many relations.'
        })
      }

      // Filter relations and keep only valid relations.
      for(var i=0; i<relations.length; i++) {
        if([ 'author', 'media', 'parentPost', 'parentPost.author', 'parentPost.media', 'rootPost', 'rootPost.author', 'rootPost.media', 'completedChallengeRelationship.challenge', 'completedChallengeRelationship.challenge.skillPoints' ].includes(relations[i])) {
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
    // Check if the post exists.
    const post = await Post.findOrFail(params.id)

    try {
      // Check if the post was liked previously.
      const likeRelation = await PostLike
      .query()
      .withTrashed()
      .where('user_id', '=', auth.user.id)
      .where('post_id', '=', post.id)
      .first()

      if(likeRelation) {
        // The user liked this post previously. Restore the relationship.
        await likeRelation.restore()
      } else {
        // Create a 'like' relationship between the user and the post.
        await auth.user.likedPosts().attach([post.id])

        if(auth.user.id !== post.author_id) {
          const postAuthor = await post.author().first()

          // Notify the post's creator.
          await NotificationSender.send(auth.user, postAuthor, new NewLikeInPost(post, auth.user))
        }
      }

      // Recount likes.
      await post.countLikes()

      // Return a success message
      return response.json({
        status: 'success'
      })
    } catch(error) {
      return response.status(400).json({
        status: 'error',
        message: 'Something went wrong, please try again.'
      })
    }
  }

  async unlike({ params, auth, response }) {
    // Check if the post exists.
    const post = await Post.findOrFail(params.id)

    try {
      // Detach the like relationship.
      await auth.user.likedPosts().detach([post.id])

      // Recount likes.
      await post.countLikes()

      // Return a success message
      return response.json({
        status: 'success'
      })
    } catch(error) {
      return response.status(400).json({
        status: 'error',
        message: 'Something went wrong, please try again.'
      })
    }
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
