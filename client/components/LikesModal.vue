<template>
  <b-modal id="likes-modal" centered :title="total!==null ? `Liked by ${total} users` : 'Loading...'" hide-footer @show="onShow" @hide="onHide">
    <div v-if="loading && likes.length === 0" class="text-primary text-center py-5">
      <div class="spinner-grow" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else id="likes-modal-content" style="max-height: 300px; overflow-y: auto; margin: -16px;">
      <div style="margin: 16px;">
        <div v-for="(like, index) in likes" :key="index" style="display: flex; flex-direction: row; align-items: center; padding: 4px 0;">
          <a href="#" style="flex-grow: 0; margin-right: 12px;">
            <avatar :user="like.user" size="md" class="d-block"/>
          </a>
          <div style="flex-grow: 1; margin-right: 12px;">
            <a href="#">@{{ like.user.username }}</a>
          </div>
          <div style="flex-grow: 0;">
            {{ like.updated_at | moment("from", "now") }}
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar
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
      likes: [],
      loading: false,
      page: 1,
      lastPage: 2,
      total: null
    }
  },

  methods: {
    onShow () {
      this.likes = []
      this.page = 1
      this.lastPage = 2
      this.total = null
      this.loadMore()

      setTimeout(() => {
        document.getElementById('likes-modal-content').addEventListener('scroll', this.onScroll)
      }, 100)
    },

    onHide () {
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
      if(!this.endpoint) {
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
