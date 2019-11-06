<template>
  <b-modal id="redraws-modal" centered :title="total!==null ? `Redrawed ${total} times` : 'Loading...'" hide-footer @show="onShow">
    <div v-if="loading && redraws.length === 0" class="text-primary text-center py-5">
      <div class="spinner-grow" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else id="redraws-modal-content" style="max-height: 300px; overflow-y: auto; margin: -16px;">
      <div style="margin: 16px;">
        <div class="list-group">
          <router-link
            v-for="(post, index) in redraws"
            :key="index"
            :to="{ name: 'posts.show', params: { id: post.id } }"
            class="list-group-item list-group-item-action"
            style="display: flex; flex-direction: row; align-items: center; padding: 0;"
          >
            <img style="flex-grow: 0; width: 80px; height: 80px; margin-right: 12px;" :src="post.media[0].variations['100x100'].url">
            <div style="flex-grow: 1; margin-right: 12px;">
              <div style="white-space: nowrap; width: 142px; overflow: hidden; text-overflow: ellipsis;">by @{{ post.author.username }}</div>
              <div style="display: flex; align-items: center;"><heart-icon style="margin-right: 4px;"/> {{ post.total_likes }}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { HeartIcon } from 'vue-feather-icons'

export default {
  components: {
    HeartIcon
  },

  props: {
    endpoint: {
      type: String,
      default: null,
      required: false
    }
  },

  data: function () {
    return {
      redraws: [],
      loading: false,
      page: 1,
      lastPage: 2,
      total: null
    }
  },

  methods: {
    onShow () {
      this.redraws = []
      this.page = 1
      this.lastPage = 2
      this.total = null
      this.loadMore()

      setTimeout(() => {
        document.getElementById('redraws-modal-content').addEventListener('scroll', this.onScroll)
      }, 100)
    },

    onHide () {
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
      if(!this.endpoint) {
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
