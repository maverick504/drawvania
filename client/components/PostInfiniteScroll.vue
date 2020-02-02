<template>
  <div class="mb-32">
    <template v-if="!loading && posts.length === 0">
      <slot name="empty-state"/>
    </template>
    <template v-else>
      <post-item
        v-for="(post, index) in posts"
        :key="post.id"
        :post="post"
      />
      <div v-if="loading" class="py-4 text-center text-primary">
        <div class="spinner" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <likes-modal/>
      <redraws-modal/>
    </template>
  </div>
</template>

<script>
import mediumZoom from 'medium-zoom'
import PostItem from '@/components/post/PostItem.vue'
import LikesModal from '@/components/modals/LikesModal.vue'
import RedrawsModal from '@/components/modals/RedrawsModal.vue'

export default {
  components: {
    PostItem,
    LikesModal,
    RedrawsModal
  },

  props: {
    endpoint: {
      type: String,
      required: true
    }
  },

  data: function () {
    return {
      posts: [],
      loading: false,
      page: 1,
      lastPage: 2
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

    async loadMore () {
      this.loading = true

      const response = await this.$axios.get(`${this.endpoint}?page=${this.page}`)

      this.posts = this.posts.concat(response.data.data)
      this.lastPage = response.data.lastPage

      setTimeout(() => {
        mediumZoom('[data-zoomable]', {
          margin: 0,
          background: '#4444'
        });
      }, 100)

      this.loading = false
    }
  }
}
</script>
