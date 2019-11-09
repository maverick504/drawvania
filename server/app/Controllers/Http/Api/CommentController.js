'use strict'

const { validateAll } = use('Validator')
const Post = use('App/Models/Post')
const PostComment = use('App/Models/PostComment')

class CommentController {
  async postIndex({ request, params }) {
    // Check if the post exists
    const post = await Post.findOrFail(params.id)

    // Return comments
    return await PostComment
    .query()
    .with('author')
    .with('replies.author')
    .where('post_id', '=', post.id)
    .whereNull('parent_comment_id')
    .orderBy('created_at', 'desc')
    .paginate(request.get().page, 10)
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
        // Store the post on database
        const commentRecord = new PostComment()
        commentRecord.author_id = auth.user.id
        commentRecord.post_id = post_id
        commentRecord.comment = comment
        await commentRecord.save()

        // Load the comment's author.
        await commentRecord.loadMany([ 'author' ])

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
      comment: `string|max:280`
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

    // Check if the comment if owned by the authenticated user
    if(comment.author_id !== auth.user.id) {
      const post = await Post.find(comment.post_id)

      if(post.author_id !== auth.user.id) {
        return response.status(400).json({
          status: 'error',
          message: "You cannot delete this comment because you are not its author."
        })
      }
    }

    // Delete the comment
    await comment.delete()

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
}

module.exports = CommentController
