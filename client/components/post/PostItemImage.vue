<template>
  <div class="bg-gray-300 relative overflow-hidden">
    <div
      v-if="!loaded"
      :style="placeholderStyle"
    />
    <div v-show="loaded">
      <img
        :src="post.media[0].variations['640wf'].url"
        :data-zoom-src="post.media[0].variations['1280w'].url" 
        :style="{ filter: censor ? 'blur(16px)' : 'none' }"
        data-zoomable
        class="z-0"
        alt="Post's image"
        @load="loaded = true"
      >
      <div 
        v-if="censor" 
        class="absolute inset-0 flex justify-center items-center p-16 text-white z-10">
        <div class="text-center">
          <p>This artwork may contain mature content.</p>
          <button 
            class="mt-2 px-4 py-2 text-white" 
            @click="censor = false">
            <eye-icon 
              size="1x" 
              class="inline-block"/> Uncover Image
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EyeIcon } from 'vue-feather-icons'

export default {
  name: 'PostItemImage',

  components: {
    EyeIcon
  },

  props: {
    post: { type: Object, required: true }
  },

  data: () => ({
    loaded: false,
    censor: false,
  }),

  computed: {
    placeholderStyle () {
      return {
        'width': '100%',
        'height': '0px',
        'padding-top': (this.post.media[0].variations['640wf'].height / this.post.media[0].variations['640wf'].width * 100).toFixed(2) + '%'
      }
    }
  },

  mounted () {
    this.censor = this.post.restriction === 'moderate-mature-content' || this.post.restriction === 'strict-mature-content'
  }
}
</script>
