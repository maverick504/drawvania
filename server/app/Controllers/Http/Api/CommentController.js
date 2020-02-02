'use strict'

const { validateAll } = use('Validator')
const PostComment = use('App/Models/PostComment')
const PostCommentLike = use('App/Models/PostCommentLike')
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const NotificationSender = use('App/Utils/NotificationSender')
const NewCommentInPost = use('App/Notifications/NewCommentInPost')
const NewReplyToCommentInPost = use('App/Notifications/NewReplyToCommentInPost')
const DeletedCommentInPost = use('App/Notifications/DeletedCommentInPost')
const NewLikeInPostComment = use('App/Notifications/NewLikeInPostComment')

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
          const postAuthor = await post.author().first()

          // Notify the post's creator.
          await NotificationSender.send(auth.user, postAuthor, new NewCommentInPost(post, commentRecord))
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
        commentRecord.updated_at = new Date()
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
    const comment = await PostComment
    .query()
    .with('author')
    .with('post')
    .where('id', params.id)
    .firstOrFail()

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
      const post = comment.getRelated('post')

      // Check if the post where the comment belongs to was created by the authenticated user.
      if(post.author_id === auth.user.id) {
        const commentAuthor = comment.getRelated('author')

        // Delete the comment
        await comment.delete()

        // Notify the comment author about that his comment was deleted.
        await NotificationSender.send(auth.user, commentAuthor, new DeletedCommentInPost(post, comment))
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
        const conversationParticipants = await User
        .query()
        .select('users.*')
        .distinct('users.id')
        .leftJoin('post_comments', 'users.id', 'post_comments.author_id')
        .where((builder) => {
          builder
          .where('post_comments.id', '=', parentComment.id)
          .orWhere('post_comments.parent_comment_id', '=', parentComment.id)
        })
        .fetch()

        // Notify the conversation participants.
        for(let user of conversationParticipants.rows) {
          if(auth.user.id !== user.id) {
            await NotificationSender.send(auth.user, user, new NewReplyToCommentInPost(parentComment, commentRecord))
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
    const comment = await PostComment
    .query()
    .with('author')
    .where('id', params.id)
    .firstOrFail()

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
          const commentAuthor = comment.getRelated('author')

          // Notify the comment's creator.
          await NotificationSender.send(auth.user, commentAuthor, new NewLikeInPostComment(comment))
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
