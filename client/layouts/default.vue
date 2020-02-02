<template>
  <div>
    <navbar/>
    <div class="navbar-space"/>
    <nuxt/>
    <canvas
      ref="confettiCanvas"
      class="fixed pointer-events-none"
      style="top: 0; left: 0; width: 100vw; height: 100vh;"/>
    <create-post-modal ref="createPostModal"/>
    <edit-post-modal ref="editPostModal"/>
    <login-modal
      v-if="!isAuthenticated"
      ref="loginModal"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Navbar from '@/components/navbar/Navbar.vue'
import CreatePostModal from '@/components/modals/CreatePostModal.vue'
import EditPostModal from '@/components/modals/EditPostModal.vue'
import LoginModal from '@/components/modals/LoginModal.vue'

export default {
  components: {
    Navbar,
    CreatePostModal,
    EditPostModal,
    LoginModal
  },

  data: function () {
    return {
      confetti: null
    }
  },

  computed: {
    ...mapGetters([ 'isAuthenticated' ])
  },

  mounted () {
    const canvasConfetti = require('canvas-confetti')
    this.confetti = canvasConfetti.create(this.$refs.confettiCanvas, { resize: true })

    this.$bus.$on('fireConfetti', this.fireConfetti)
  },

  methods: {
    fireConfetti () {
      this.confetti({
        particleCount: 150,
        spread: 160
      })
    }
  }
}
</script>
