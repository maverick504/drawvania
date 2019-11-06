<template>
  <b-button
    variant="link"
    v-b-tooltip.hover title="Like"
    class="like-button" style="display: inline-block; padding: 0;"
    @click="toggleLike()"
  >
    <heart-icon size="2x" :class="{ 'filled': userLiked }"/>
  </b-button>
</template>

<script>
import { mapGetters } from 'vuex'
import { HeartIcon } from 'vue-feather-icons'

export default {
  components: {
    HeartIcon
  },

  props: {
    likeEndpoint: { type: String, required: true },
    unlikeEndpoint: { type: String, required: true },
    userLiked: { type: Boolean, default: false, required: false },
    totalLikes: { type: Number, required: true }
  },

  data: function () {
    return {
      busy: false
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated']),
  },

  methods: {
    async toggleLike () {
      if(!this.isAuthenticated) {
        this.$bus.$emit('showLoginModal')
        return
      }

      if(this.busy) {
        return
      }

      if (!this.userLiked) {
        await this.like()
      } else {
        await this.unlike()
      }
    },

    async like () {
      this.busy = true

      this.$emit('update:userLiked', true)
      this.$emit('update:totalLikes', this.totalLikes + 1)

      try {
        await this.$axios.post(this.likeEndpoint)
      } catch(error) {
        this.$emit('update:userLiked', false)
        this.$emit('update:totalLikes', this.totalLikes - 1)
      }

      this.busy = false
    },

    async unlike () {
      this.busy = true

      this.$emit('update:userLiked', false)
      this.$emit('update:totalLikes', this.totalLikes - 1)

      try {
        await this.$axios.post(this.unlikeEndpoint)
      } catch(error) {
        this.$emit('update:userLiked', true)
        this.$emit('update:totalLikes', this.totalLikes + 1)
      }

      this.busy = false
    }
  }
}
</script>
