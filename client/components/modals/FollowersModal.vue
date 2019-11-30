<template>
  <t-modal 
    v-model="show" 
    :header="total!==null ? `Followed by ${total} users` : 'Loading...'" 
    width="400" 
    height="0" 
    @before-open="beforeOpen" 
    @closed="closed">
    <div 
      id="followers-modal-content" 
      class="overflow-y-auto -m-4 p-4 pb-0" 
      style="max-height: 300px;">
      <div v-if="!loading">
        <div 
          v-for="followerRelation in followers" 
          :key="followerRelation.id" 
          class="flex items-center text-sm mb-4">
          <div class="flex-initial pr-2">
            <router-link :to="{ name: 'users.show', params: { username: followerRelation.follower.username } }">
              <avatar 
                :user="followerRelation.follower" 
                size="10" 
                class="d-block"/>
            </router-link>
          </div>
          <div class="flex-grow">
            <div class="block">
              <router-link 
                :to="{ name: 'users.show', params: { username: followerRelation.follower.username } }" 
                class="font-bold leading-none mr-2">
                {{ followerRelation.follower.username }}
              </router-link>
            </div>
            <div class="text-gray-600">
              {{ followerRelation.updated_at | moment("from", "now") }}
            </div>
          </div>
        </div>
      </div>
      <div 
        v-else 
        class="text-primary text-center pb-4">
        <div 
          class="spinner" 
          role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </t-modal>
</template>

<script>
import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar
  },

  data: function () {
    return {
      show: false,
      endpoint: null,
      followers: [],
      loading: false,
      page: 1,
      lastPage: 2,
      total: null
    }
  },

  mounted () {
    this.$bus.$on('showFollowersModal', (endpoint) => {
      this.endpoint = endpoint
      this.loadMore()

      this.show = true
    })
  },

  beforeDestroy () {
    this.$bus.$off('showFollowersModal')
  },

  methods: {
    beforeOpen () {
      this.followers = []
      this.page = 1
      this.lastPage = 2
      this.total = null
      this.loadMore()

      setTimeout(() => {
        document.getElementById('followers-modal-content').addEventListener('scroll', this.onScroll)
      }, 100)
    },

    closed () {
      document.getElementById('followers-modal-content').removeEventListener('scroll', this.onScroll)
    },

    onScroll (event) {
      const modalContent = document.getElementById('followers-modal-content')
      const bottomOfWindow = modalContent.scrollTop + modalContent.clientHeight === modalContent.scrollHeight
      if (bottomOfWindow && !this.loading && (this.page !== this.lastPage)) {
        this.page++
        this.loadMore()
      }
    },

    async loadMore () {
      if(!this.endpoint || this.loading) {
        return
      }

      this.loading = true

      const response = await this.$axios.get(`${this.endpoint}?page=${this.page}`)

      this.followers = this.followers.concat(response.data.data)
      this.lastPage = response.data.lastPage
      this.total = response.data.total

      this.loading = false
    }
  }
}
</script>
