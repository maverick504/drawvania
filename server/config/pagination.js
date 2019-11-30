'use strict'

const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | API default pagination limits
  |--------------------------------------------------------------------------
  |
  \ The default pagination limits on API methods where pagination is used.
  |
  */
  defaultApiPaginationLimit: {
    feed: {
      global: Env.get('DEFAULT_GLOBAL_FEED_PAGINATION_LIMIT', 5)
    },
    posts: {
      likes: Env.get('DEFAULT_POST_LIKES_PAGINATION_LIMIT', 15),
      redraws: Env.get('DEFAULT_POST_REDRAWS_PAGINATION_LIMIT', 15)
    },
    comments: Env.get('DEFAULT_COMMENTS_PAGINATION_LIMIT', 5),
    user: {
      followers: Env.get('DEFAULT_USER_FOLLOWERS_PAGINATION_LIMIT', 15),
      followings: Env.get('DEFAULT_USER_FOLLOWINGS_PAGINATION_LIMIT', 15)
    }
  }
}
