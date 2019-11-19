<template>
  <div class="image">
    <div
      v-if="!loaded"
      :style="style"
    ></div>
    <img
      v-if="zoomSrc"
      v-show="loaded"
      :src="src"
      :data-zoom-src="zoomSrc"
      :alt="alt"
      data-zoomable
      class="img-responsive"
      @load="loaded = true"
    >
    <img
      v-else
      v-show="loaded"
      :src="src"
      :alt="alt"
      class="img-responsive"
      @load="loaded = true"
    >
    <slot v-show="loaded"/>
  </div>
</template>

<script>
export default {
  name: 'VImage',

  props: {
    src: { default: null, type: String, required: true },
    zoomSrc: { default: null, type: String, required: false },
    alt: { default: null, type: String, required: false },
    width: { default: null, type: Number, required: true },
    height: { default: null, type: Number, required: true }
  },

  data: () => ({
    loaded: false
  }),

  computed: {
    style () {
      return {
        'width': '100%',
        'height': '0px',
        'padding-top': (this.height / this.width * 100).toFixed(2) + '%'
      }
    }
  }
}
</script>

<style lang="css" scoped>
.image {
  background: #e0e0e0;
}
.image img {
  width: 100%;
  height: auto;
}
</style>
