<template>
  <div class="image" style="background: #eee;">
    <template v-if="!loaded">
      <div :style="style"></div>
      <div class="image-spinner">
        <div class="spinner-grow text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </template>
    <img
      v-show="loaded"
      :src="src"
      :data-zoom-src="zoomSrc"
      :alt="alt"
      class="img-responsive"
      @load="loaded=true"
      data-zoomable
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
    ratioWidth: { default: null, type: Number, required: true },
    ratioHeight: { default: null, type: Number, required: true }
  },

  data: () => ({
    loaded: false
  }),

  computed: {
    style () {
      return {
        'width': '100%',
        'height': '0px',
        'padding-top': (this.ratioHeight / this.ratioWidth * 100).toFixed(2) + '%'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  position: relative;
  .image-spinner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    width: 100%;
    height: auto;
  }
}
</style>
