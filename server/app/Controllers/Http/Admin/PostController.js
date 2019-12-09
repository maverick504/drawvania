'use strict'

const Post = use('App/Models/Post')

class PostController {

  async index ({ request, view }) {
    const posts = await Post.query().with('author').with('media').paginate(request.get().page, 15)

    return view.render('admin.posts.index', { posts: posts.toJSON() })
  }

  async show ({ params, view }) {
    const post = await Post
    .query()
    .with('author')
    .with('media')
    .where('id', params.id)
    .first()

    return view.render('admin.posts.show', {
      post: post.toJSON()
    })
  }

  async destroy({ params, auth, response }) {
    // Get the required post
    const post = await Post.findOrFail(params.id)

    // Delete the post
    await post.delete()

    // Redirect to the posts list page.
    response.redirect(`/admin/posts`)
  }

}

module.exports = PostController
