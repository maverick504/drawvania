<template>
  <feed-layout>
    <template slot="context-header">
      Stats
    </template>
    <div class="p-4">
      <div class="flex bg-white px-6 py-12 rounded-lg shadow-lg mb-4">
        <div class="w-1/2 text-center">
          <div class="text-gray-900 font-bold text-2xl">{{ stats.counters.createdPosts }}</div>
          <div class="text-gray-600 text-lg">Posts</div>
        </div>
        <div class="w-1/2 text-center">
          <div class="text-gray-900 font-bold text-2xl">{{ stats.counters.receivedLikes }}</div>
          <div class="text-gray-600 text-lg">Likes</div>
        </div>
        <div class="w-1/2 text-center">
          <div class="text-gray-900 font-bold text-2xl">{{ stats.counters.followers }}</div>
          <div class="text-gray-600 text-lg">Followers</div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg mb-4">
        <div class="text-center text-xl mb-4"><abbr title="Skill Points, earned through completed challenges." class="no-underline border-dotted">SP</abbr> distribution ({{ stats.counters.receivedSkillPoints }} in total)</div>
        <skill-points-distribution-chart :data="stats.userSkillPoints"/>
      </div>
    </div>
  </feed-layout>
</template>

<script>
import FeedLayout from '@/components/FeedLayout.vue'
import SkillPointsDistributionChart from '@/components/charts/SkillPointsDistribution.js'

export default {
  middleware: 'auth',

  components: {
    FeedLayout,
    SkillPointsDistributionChart
  },

  data: function () {
    return {
      stats: null
    }
  },

  async asyncData ({ $axios, params, error }) {
    try {
      const response = await $axios.get(`/stats`)

      return {
        stats: response.data
      }
    } catch (err) {
      return error({ statusCode: err.response.status })
    }
  }
}
</script>
