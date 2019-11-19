<template>
  <t-modal v-model="show" :header="total!==null ? `Redrawed ${total} times` : 'Loading...'" width="400" height="0" @before-open="beforeOpen" @closed="closed">
    <div id="redraws-modal-content" class="overflow-y-auto -m-4 p-4 pb-0" style="max-height: 300px;">
      <div v-if="!loading" class="mb-4">
        <div v-for="(post, index) in redraws" :key="index" class="flex items-center text-sm">
          <div class="flex-initial pr-2">
            <router-link :to="{ name: 'posts.show', params: { id: post.id } }">
              <img class="w-16 h-16 rounded" :src="post.media[0].variations['100x100'].url">
            </router-link>
          </div>
          <div class="flex-grow">
            <div class="block">
              by <router-link :to="{ name: 'users.show', params: { username: post.author.username } }" class="font-bold leading-none">{{ post.author.username }}</router-link>
            </div>
            <div class="text-gray-600">
              <span>{{ post.date | moment("from", "now") }}</span> &bull;
              <span v-if="post.updated_at > post.date">edited {{ post.updated_at | moment("from", "now") }}</span>
            </div>
          </div>
          <div class="flex-initial whitespace-no-wrap pl-2">
            <heart-icon class="inline-block"/> {{ post.total_likes }}
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
import { HeartIcon } from 'vue-feather-icons'

export default {
  components: {
    HeartIcon
  },

  data: function () {
    return {
      show: false,
      endpoint: null,
      redraws: [],
      loading: false,
      page: 1,
      lastPage: 2,
      total: null
    }
  },

  mounted () {
    this.$bus.$on('showRedrawsModal', (endpoint) => {
      this.endpoint = endpoint
      this.loadMore()

      this.show = true
    })
  },

  beforeDestroy () {
    this.$bus.$off('showRedrawsModal')
  },

  methods: {
    beforeOpen () {
      this.redraws = []
      this.page = 1
      this.lastPage = 2
      this.total = null
      this.loadMore()

      setTimeout(() => {
        document.getElementById('redraws-modal-content').addEventListener('scroll', this.onScroll)
      }, 100)
    },

    closed () {
      document.getElementById('redraws-modal-content').removeEventListener('scroll', this.onScroll)
    },

    onScroll (event) {
      const modalContent = document.getElementById('redraws-modal-content')
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

      this.redraws = this.redraws.concat(response.data.data)
      this.lastPage = response.data.lastPage
      this.total = response.data.total

      this.loading = false
    }
  }
}
</script>
