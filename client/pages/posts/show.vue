<template>
  <div>
    <feed-layout>
      <div class="p-4">
        <post-item 
          :post="post" 
          class="mb-32"/>
      </div>
    </feed-layout>
    <likes-modal/>
    <redraws-modal/>
  </div>
</template>

<script>
import mediumZoom from 'medium-zoom'
import FeedLayout from '@/components/FeedLayout.vue'
import PostItem from '@/components/post/PostItem.vue'
import LikesModal from '@/components/modals/LikesModal.vue'
import RedrawsModal from '@/components/modals/RedrawsModal.vue'

export default {
  components: {
    FeedLayout,
    PostItem,
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
