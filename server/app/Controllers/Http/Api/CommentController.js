'use strict'

const { validateAll } = use('Validator')
const PostComment = use('App/Models/PostComment')
const PostCommentLike = use('App/Models/PostCommentLike')
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Notification = use('App/Models/Notification')

class CommentController {
  async postIndex({ request, auth, params }) {
    // Check if the post exists
    const post = await Post.findOrFail(params.id)

    // Query comments
    var query = PostComment.query()

    if(auth.user) {
      query.withLikes(auth.user.id)
    } else {
      query.select([ 'post_comments.*' ])
    }

    return await query
    .with('author')
    .with('replies', (builder) => {
      builder
      .withLikes(auth.user.id)
      .with('author')
      .orderBy('total_likes', 'desc')
      .orderBy('created_at', 'desc')
    })
    .where('post_id', '=', post.id)
    .whereNull('parent_comment_id')
    .orderBy('total_likes', 'desc')
    .orderBy('created_at', 'desc')
    .paginate(request.get().page, 5)
  }

  async store({ request, auth, response }) {
    const rules = {
      post_id: `required|exists:posts,id`,
      comment: `required|string|max:280`
    }

    const { post_id, comment } = request.only([ 'post_id', 'comment' ])

    // Validate the fields in the request
    const validation = await validateAll({ post_id, comment }, rules)

    if (!validation.fails()) {
      try {
        // Store the comment on database
        const commentRecord = new PostComment()
        commentRecord.author_id = auth.user.id
        commentRecord.post_id = post_id
        commentRecord.comment = comment
        await commentRecord.save()

        // Get the comment's post.
        const post = await commentRecord.post().first()

        if(auth.user.id !== post.author_id) {

          // Notify the post's creator.
          const notification = new Notification()
          notification.triggerer_id = auth.user.id
          notification.notifiable_id = post.author_id
          notification.entity_id = post.id
          notification.entity_type = 'App/Models/Post'
          notification.type = 'newCommentInPost'
          notification.metadata = {
            comment: {
              id: commentRecord.id,
              comment: commentRecord.comment
            }
          }
          await notification.save()
        }

        // Load the comment's author.
        await commentRecord.load('author')

        // Return a success message
        return response.json({
          status: 'success',
          data: commentRecord
        })
      } catch(error) {
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
    // Get the required comment
    const commentRecord = await PostComment.findOrFail(params.id)

    // Check if the post if owned by the authenticated user
    if(commentRecord.author_id !== auth.user.id) {
      return response.status(400).json({
        status: 'error',
        message: "You cannot modify this comment because you are not its author."
      })
    }

    const rules = {
      comment: `required|string|max:280`
    }

    const { comment } = request.only([ 'comment' ])

    // Validate the fields in the request
    const validation = await validateAll({ comment }, rules)

    if (!validation.fails()) {
      try {
        // Update the comment's data
        commentRecord.comment = comment
        await commentRecord.save()

        // Return a success message
        return response.json({
          status: 'success',
          data: commentRecord
        })
      } catch(error) {
        return response.status(400).json({
          status: 'error',
          message: 'Something went wrong, please try again.'
        })
      }
    } else {
      response.status(400).send(validation.messages())
    }
  }

  async destroy({ params, auth, response }) {
    // Get the required comment
    const comment = await PostComment.findOrFail(params.id)

    // Comment with replies cannot be deleted.
    if(comment.total_replies > 0) {
      return response.status(400).json({
        status: 'error',
        message: "You cannot delete this comment because it has replies."
      })
    }

    // Check if the comment was created by the authenticated user.
    if(comment.author_id === auth.user.id) {
      // Delete the comment
      await comment.delete()
    } else {
      const post = await Post.find(comment.post_id)

      // Check if the post where the comment belongs to was created by the authenticated user.
      if(post.author_id === auth.user.id) {
        // Delete the comment
        await comment.delete()

        // Notify the comment author about that his comment was deleted.
        const notification = new Notification()
        notification.triggerer_id = auth.user.id
        notification.notifiable_id = comment.author_id
        notification.entity_id = post.id
        notification.entity_type = 'App/Models/Post'
        notification.type = 'deletedCommentInPost'
        notification.metadata = {
          comment: {
            id: comment.id,
            comment: comment.comment
          }
        }
        await notification.save()
      } else {
        return response.status(400).json({
          status: 'error',
          message: "You cannot delete this comment because you are not its author."
        })
      }
    }

    // Return a success message
    return response.json({
      status: 'success'
    })
  }

  async reply({ request, params, auth, response }) {
    // Get the required comment
    const parentComment = await PostComment.findOrFail(params.id)

    // Check if the post if owned by the authenticated user
    if(parentComment.parent_comment_id) {
      return response.status(400).json({
        status: 'error',
        message: "You cannot directly reply to a reply. Reply the original comment instead."
      })
    }

    const rules = {
      comment: `required|string|max:280`
    }

    const { comment } = request.only([ 'comment' ])

    // Validate the fields in the request
    const validation = await validateAll({ comment }, rules)

    if (!validation.fails()) {
      try {
        // Store the post on database
        const commentRecord = new PostComment()
        commentRecord.author_id = auth.user.id
        commentRecord.post_id = parentComment.post_id
        commentRecord.parent_comment_id = parentComment.id
        commentRecord.comment = comment
        await commentRecord.save()

        // Get the comment/conversation participants.
        const conversationParticipants = await User.query()
        .select('users.*')
        .distinct('users.id')
        .leftJoin('post_comments', 'users.id', 'post_comments.author_id')
        .where((builder) => {
          builder.where('post_comments.id', '=', parentComment.id)
          .orWhere('post_comments.parent_comment_id', '=', parentComment.id)
        })
        .fetch()

        // Notify the conversation participants.
        for(let user of conversationParticipants.rows) {
          if(auth.user.id !== user.id) {
            const notification = new Notification()
            notification.triggerer_id = auth.user.id
            notification.notifiable_id = user.id
            notification.entity_id = parentComment.id
            notification.entity_type = 'App/Models/PostComment'
            notification.type = 'newReplyToCommentInPost'
            notification.metadata = {
              comment: {
                id: commentRecord.id,
                comment: commentRecord.comment
              }
            }
            await notification.save()
          }
        }

        // Load the comment's author.
        await commentRecord.load('author')

        // Return a success message
        return response.json({
          status: 'success',
          data: commentRecord
        })
      } catch(error) {
        return response.status(400).json({
          status: 'error',
          message: 'Something went wrong, please try again.'
        })
      }
    } else {
      response.status(400).send(validation.messages())
    }
  }

  async like({ params, auth, response }) {
    // Check if the comment exists.
    const comment = await PostComment.findOrFail(params.id)

    try {
      // Check if the comment was liked previously.
      const likeRelation = await PostCommentLike
      .query()
      .withTrashed()
      .where('user_id', '=', auth.user.id)
      .where('comment_id', '=', comment.id)
      .first()

      if(likeRelation) {
        // The user liked this comment previously. Restore the relationship.
        await likeRelation.restore()
      } else {
        // Create a 'like' relationship between the user and the comment.
        await auth.user.likedPostComments().attach([comment.id])

        if(auth.user.id !== comment.author_id) {
          // Notify the comment's creator.
          const notification = new Notification()
          notification.triggerer_id = auth.user.id
          notification.notifiable_id = comment.author_id
          notification.entity_id = comment.id
          notification.entity_type = 'App/Models/PostComment'
          notification.type = 'newLikeInPostComment'
          notification.metadata = {}
          await notification.save()
        }
      }

      // Recount likes.
      await comment.countLikes()

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
    // Check if the comment exists.
    const comment = await PostComment.findOrFail(params.id)

    try {
      // Detach the like relationship.
      await auth.user.likedPostComments().detach([comment.id])

      // Recount likes.
      await comment.countLikes()

      // Return a success message.
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
}

module.exports = CommentController
