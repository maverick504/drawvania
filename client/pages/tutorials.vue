<template>
  <feed-layout :white-bg="true">
    <template slot="context-header">
      Drawing tutorials
    </template>
    <div class="p-4">
      <div class="bg-primary-100 border-l-4 border-primary-500 text-primary-700 p-4 mb-4">
        Use any of the following hashtags to make it easier to people to find your tutorial.
      </div>
      <router-link
        v-for="hashtag in tutorialHashtags"
        :key="hashtag.id"
        :to="{ name: 'explore.hashtags', params: { slug: hashtag.slug } }"
        class="block px-4 py-2 hover:bg-gray-100"
      >
        <strong class="block text-gray-900">{{ `#${hashtag.slug}` }}</strong>
        <span class="block text-gray-600">{{ `${hashtag.total_posts} illustrations` }}</span>
      </router-link>
    </div>
  </feed-layout>
</template>

<script>
import FeedLayout from '@/components/FeedLayout.vue'
import PostInfiniteScroll from '@/components/PostInfiniteScroll.vue'

export default {
  components: {
    FeedLayout,
    PostInfiniteScroll
  },

  data: function () {
    return {
      tutorialHashtags: []
    }
  },

  mounted () {
    this.fetchTutorialHashtags()
  },

  methods: {
    async fetchTutorialHashtags () {
      const response = await this.$axios.get('/tutorial-hashtags')
      this.tutorialHashtags = response.data
    }
  }
}
</script>
