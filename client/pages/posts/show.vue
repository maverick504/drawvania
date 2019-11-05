<template>
  <div>
    <post
      :post="post"
      class="mb-3"
      @showLikesModal="showLikesModal()"
      @showRedrawsModal="showRedrawsModal()"
    />
    <likes-modal ref="likesModal" :endpoint="`/posts/${post.id}/likes`"/>
    <redraws-modal ref="RedrawsModal" :endpoint="`/posts/${post.id}/redraws`"/>
  </div>
</template>

<script>
import mediumZoom from 'medium-zoom'
import Post from '@/components/Post.vue'
import LikesModal from '@/components/LikesModal.vue'
import RedrawsModal from '@/components/RedrawsModal.vue'

export default {
  components: {
    Post,
    LikesModal,
    RedrawsModal
  },

  data: function () {
    return {
      post: null
    }
  },

  async asyncData ({ $axios, params, error }) {
    try {
      const response = await $axios.get(`/posts/${params.id}?with=author,media,parentPost.author,parentPost.media`)

      return {
        post: response.data
      }
    } catch (err) {
      return error({ statusCode: err.response.status })
    }
  },

  mounted () {
    this.$nextTick(() => {
      mediumZoom('[data-zoomable]', {
        margin: 0,
        background: '#4444'
      })
    })
  },

  methods: {
    showLikesModal () {
      this.$bvModal.show('likes-modal')
    },

    showRedrawsModal () {
      this.$bvModal.show('redraws-modal')
    }
  }
}
</script>
