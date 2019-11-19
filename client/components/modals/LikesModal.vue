<template>
  <t-modal v-model="show" :header="total!==null ? `Liked by ${total} users` : 'Loading...'" width="400" height="0" @before-open="beforeOpen" @closed="closed">
    <div id="likes-modal-content" class="overflow-y-auto -m-4 p-4 pb-0" style="max-height: 300px;">
      <div v-if="!loading">
        <div v-for="likeRelation in likes" :key="likeRelation.id" class="flex items-center text-sm mb-4">
          <div class="flex-initial pr-2">
            <router-link :to="{ name: 'users.show', params: { username: likeRelation.user.username } }">
              <avatar :user="likeRelation.user" size="10" class="d-block"/>
            </router-link>
          </div>
          <div class="flex-grow">
            <div class="block">
              <router-link :to="{ name: 'users.show', params: { username: likeRelation.user.username } }" class="font-bold leading-none mr-2">
                {{ likeRelation.user.username }}
              </router-link>
            </div>
            <div class="text-gray-600">
              {{ likeRelation.updated_at | moment("from", "now") }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-primary text-center pb-4">
        <div class="spinner" role="status">
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
      likes: [],
      loading: false,
      page: 1,
      lastPage: 2,
      total: null
    }
  },

  mounted () {
    this.$bus.$on('showLikesModal', (endpoint) => {
      this.endpoint = endpoint
      this.loadMore()

      this.show = true
    })
  },

  beforeDestroy () {
    this.$bus.$off('showLikesModal')
  },

  methods: {
    beforeOpen () {
      this.likes = []
      this.page = 1
      this.lastPage = 2
      this.total = null
      this.loadMore()

      setTimeout(() => {
        document.getElementById('likes-modal-content').addEventListener('scroll', this.onScroll)
      }, 100)
    },

    closed () {
      document.getElementById('likes-modal-content').removeEventListener('scroll', this.onScroll)
    },

    onScroll (event) {
      const modalContent = document.getElementById('likes-modal-content')
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

      this.likes = this.likes.concat(response.data.data)
      this.lastPage = response.data.lastPage
      this.total = response.data.total

      this.loading = false
    }
  }
}
</script>
