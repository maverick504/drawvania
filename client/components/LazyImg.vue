<template>
  <div class="bg-gray-300 relative lazy-img">
    <div
      v-if="!loaded"
      :style="placeholderStyle"
      class="lazy-img-placeholder"
    ></div>
    <img
      v-show="loaded"
      :src="src"
      :alt="alt"
      class="lazy-img-image"
      @load="loaded = true"
    >
    <slot v-show="loaded"/>
  </div>
</template>

<script>
export default {
  name: 'LazyImg',

  props: {
    src: { default: null, type: String, required: true },
    alt: { default: null, type: String, required: false },
    width: { default: null, type: Number, required: true },
    height: { default: null, type: Number, required: true }
  },

  data: () => ({
    loaded: false
  }),

  computed: {
    placeholderStyle () {
      return {
        'width': '100%',
        'height': '0px',
        'padding-top': (this.height / this.width * 100).toFixed(2) + '%'
      }
    }
  }
}
</script>
