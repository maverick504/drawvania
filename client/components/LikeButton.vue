<template>
  <button class="text-red" @click="toggleLike()">
    <heart-icon :size="size" :class="{ 'filled': loggedInUserLiked }"/>
  </button>
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
    loggedInUserLiked: { type: Boolean, default: false, required: false },
    totalLikes: { type: Number, required: true },
    size: { type: String, default: '2x', required: false },
  },

  data: function () {
    return {
      busy: false
    }
  },

  computed: {
    ...mapGetters([ 'isAuthenticated' ]),
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

      if (!this.loggedInUserLiked) {
        await this.like()
      } else {
        await this.unlike()
      }
    },

    async like () {
      this.busy = true

      this.$emit('update:loggedInUserLiked', true)
      this.$emit('update:totalLikes', this.totalLikes + 1)

      try {
        await this.$axios.post(this.likeEndpoint)
      } catch(error) {
        this.$emit('update:loggedInUserLiked', false)
        this.$emit('update:totalLikes', this.totalLikes - 1)
      }

      this.busy = false
    },

    async unlike () {
      this.busy = true

      this.$emit('update:loggedInUserLiked', false)
      this.$emit('update:totalLikes', this.totalLikes - 1)

      try {
        await this.$axios.post(this.unlikeEndpoint)
      } catch(error) {
        this.$emit('update:loggedInUserLiked', true)
        this.$emit('update:totalLikes', this.totalLikes + 1)
      }

      this.busy = false
    }
  }
}
</script>
