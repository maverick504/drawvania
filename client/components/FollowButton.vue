<template>
  <button 
    :class="{ [`${baseClass}`]: true }" 
    @click="toggleFollow()">
    {{ loggedInUserIsFollower ? 'Following' : 'Follow' }}
  </button>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    followEndpoint: { type: String, required: true },
    unfollowEndpoint: { type: String, required: true },
    loggedInUserIsFollower: { type: Boolean, default: false, required: false },
    totalFollowers: { type: Number, required: true },
    baseClass: { type: String, default: 'text-primary', required: false}
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
    async toggleFollow () {
      if(!this.isAuthenticated) {
        this.$bus.$emit('showLoginModal')
        return
      }

      if(this.busy) {
        return
      }

      if (!this.loggedInUserIsFollower) {
        await this.follow()
      } else {
        await this.unfollow()
      }
    },

    async follow () {
      this.busy = true

      this.$emit('update:loggedInUserIsFollower', true)
      this.$emit('update:totalFollowers', this.totalFollowers + 1)

      try {
        await this.$axios.post(this.followEndpoint)
      } catch(error) {
        this.$emit('update:loggedInUserIsFollower', false)
        this.$emit('update:totalFollowers', this.totalFollowers - 1)
      }

      this.busy = false
    },

    async unfollow () {
      this.busy = true

      this.$emit('update:loggedInUserIsFollower', false)
      this.$emit('update:totalFollowers', this.totalFollowers - 1)

      try {
        await this.$axios.post(this.unfollowEndpoint)
      } catch(error) {
        this.$emit('update:loggedInUserIsFollower', true)
        this.$emit('update:totalFollowers', this.totalFollowers + 1)
      }

      this.busy = false
    }
  }
}
</script>
