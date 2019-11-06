<template>
  <button v-show="show" class="to-top-button" type="button" @click="scrollToTop">
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
