<template>
  <feed-layout>
    <template slot="context-header">
      <div class="flex items-center">
        <div class="flex-grow">
          Drawing challenges
        </div>
        <div class="flex-none">
          <select v-model="selectedSkill" class="bg-primary px-2 py-1 font-normal text-white text-sm rounded-full">
            <option value="all">All</option>
            <option v-for="skill in mainSkills" :value="skill.id">{{ skill.short_name }}</option>
          </select>
        </div>
      </div>
    </template>
    <div class="p-4 mb-32">
      <div class="mb-32">
        <template v-if="!loading && challenges.length === 0">
          <slot name="empty-state"/>
        </template>
        <template v-else>
          <challenge-item
            v-for="(challenge, index) in challenges"
            :key="challenge.id"
            :challenge="challenge"
          />
          <div v-if="loading" class="py-4 text-center text-primary">
            <div class="spinner" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </feed-layout>
</template>

<script>
import FeedLayout from '@/components/FeedLayout.vue'
import ChallengeItem from '@/components/ChallengeItem.vue'

export default {
  components: {
    FeedLayout,
    ChallengeItem
  },

  data: function () {
    return {
      mainSkills: [],
      selectedSkill: 'all',
      challenges: [],
      loading: false,
      page: 1,
      lastPage: 2
    }
  },

  async asyncData ({ $axios, params, error }) {
    try {
      const response = await $axios.get(`/main-skills`)

      return {
        mainSkills: response.data
      }
    } catch (err) {
      return error({ statusCode: err.response.status })
    }
  },

  mounted () {
    document.addEventListener('scroll', this.onScroll)
    this.loadMore()
  },

  destroyed () {
    document.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    onScroll (event) {
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= (document.documentElement.offsetHeight - 128)
      if (bottomOfWindow && !this.loading && (this.page < this.lastPage)) {
        this.page++
        this.loadMore()
      }
    },

    clearResults () {
      this.challenges = []
      this.page = 1
      this.lastPage = 2
    },

    async loadMore () {
      this.loading = true

      var response
      if(this.selectedSkill && this.selectedSkill !== 'all') {
        response = await this.$axios.get(`/challenges?skill_id=${this.selectedSkill}&page=${this.page}`)
      } else {
        response = await this.$axios.get(`/challenges?page=${this.page}`)
      }

      this.challenges = this.challenges.concat(response.data.data)
      this.lastPage = response.data.lastPage

      this.loading = false
    }
  },

  watch: {
    selectedSkill (value) {
      this.clearResults()
      this.loadMore()
    }
  }
}
</script>
