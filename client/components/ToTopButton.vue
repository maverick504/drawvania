<template>
  <button v-show="show" type="button" @click="scrollToTop" style="position: fixed; top: 74px; left: 50%; transform: translateX(-50%); z-index: 999; background: #222; padding: 4px 8px; color: #fff; border: 1px solid #111; border-radius: 4px; white-space: nowrap;">
    scroll to top <arrow-up-icon size="0.9x"/>
  </button>
</template>

<script>
import { ArrowUpIcon } from 'vue-feather-icons'

export default {
  components: {
    ArrowUpIcon
  },

  data: function () {
    return {
      show: false
    }
  },

  mounted () {
    window.addEventListener('scroll', this.onScroll)
  },

  destroyed () {
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    onScroll () {
      if(document.documentElement.scrollTop > 100) {
        this.show = true
      } else {
        this.show = false
      }
    },

    scrollToTop () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>
