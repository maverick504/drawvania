<template>
  <div class="infinite-scroll">
    <post-item
      v-for="(post, index) in posts"
      :key="index"
      :post="post"
      class="mb-3"
      @showLikesModal="showLikesModal(post.id)"
      @showRedrawsModal="showRedrawsModal(post.id)"
    />
    <div v-if="loading" class="spinner-container text-primary">
      <div class="spinner-grow" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-if="page >= lastPage" class="end-of-results">
      end of results
    </div>
    <likes-modal ref="likesModal" :endpoint="likesEndpoint"/>
    <redraws-modal ref="RedrawsModal" :endpoint="redrawsEndpoint"/>
  </div>
</template>

<script>
import mediumZoom from 'medium-zoom'
import PostItem from '@/components/post/PostItem.vue'
import LikesModal from '@/components/LikesModal.vue'
import RedrawsModal from '@/components/RedrawsModal.vue'

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
      lastPage: 2,
      likesEndpoint: null,
      redrawsEndpoint: null
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
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight
      if (bottomOfWindow && !this.loading && (this.page !== this.lastPage)) {
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
    },

    showLikesModal (postId) {
      this.likesEndpoint = `/posts/${postId}/likes`
      this.$nextTick(() => {
        this.$bvModal.show('likes-modal')
      })
    },

    showRedrawsModal (postId) {
      this.redrawsEndpoint = `/posts/${postId}/redraws`
      this.$nextTick(() => {
        this.$bvModal.show('redraws-modal')
      })
    }
  }
}
</script>
