<template>
  <div>
    <div class="flex justify-center bg-white" style="min-height: calc(100vh - 57px);">
      <div class="flex">
        <aside class="flex-initial border-r z-30" style="min-width: 254px;">
          <no-ssr>
            <affix
              :offset="{ top: 57, bottom: 0 }"
              :scroll-affix="false"
              :style="{ transform: `translateX(-${windowScrollX}px)` }"
              relative-element-selector="#content"
              style="width: 254px;"
            >
              <div class="py-4">
                <div v-if="isAuthenticated" class="mb-4">
                  <router-link
                    :to="{ name: 'stats' }"
                    class="block px-4 py-2"
                    exact-active-class="border-l-4 border-primary"
                  >
                    Stats
                  </router-link>
                </div>
                <div class="mb-4">
                  <div class="mx-4 my-2 text-sm text-gray-600 font-bold uppercase">Practice/Learn</div>
                  <router-link
                    :to="{ name: 'challenges.index' }"
                    class="block px-4 py-2"
                    exact-active-class="border-l-4 border-primary"
                  >
                    Drawing challenges
                  </router-link>
                </div>
                <div class="mb-4">
                  <div class="mx-4 mb-2 text-sm text-gray-600 font-bold uppercase">Community</div>
                  <router-link
                    :to="{ name: 'feed.global' }"
                    class="block px-4 py-2"
                    exact-active-class="border-l-4 border-primary"
                  >
                    Recent works
                  </router-link>
                  <router-link
                    v-if="isAuthenticated"
                    :to="{ name: 'feed.followings' }"
                    class="block px-4 py-2"
                    exact-active-class="border-l-4 border-primary"
                  >
                    Followings works
                  </router-link>
                </div>
              </div>
            </affix>
          </no-ssr>
        </aside>
        <main id="content" :class="{ [ whiteBg ? 'bg-white' : 'bg-gray-100' ]: true }" class="flex-grow relative" style="width: 560px;">
          <div
            :style="{ transform: `translateX(-${windowScrollX}px)` }"
            v-show="!!this.$slots['context-header']"
            class="fixed bg-white p-4 font-bold text-lg border-b z-20"
            style="margin: 0 1px; width: 560px; top: 57px;"
          >
            <slot name="context-header"/>
          </div>
          <div v-show="!!this.$slots['context-header']" style="height: 60px;"/>
          <slot/>
        </main>
        <aside class="flex-initial border-l z-30" style="min-width: 254px;">
          <no-ssr>
            <affix
              :offset="{ top: 57, bottom: 0 }"
              :scroll-affix="false"
              :style="{ transform: `translateX(-${windowScrollX}px)` }"
              relative-element-selector="#content"
              style="width: 254px;"
            >
              <div class="py-4">
                <div class="mb-4">
                  <div class="mx-4 my-2 text-sm text-gray-600 font-bold uppercase">Featured hashtags</div>
                  <router-link
                    v-for="hashtag in featuredHashtags"
                    :key="hashtag.id"
                    :to="{ name: 'explore.hashtags', params: { slug: hashtag.slug } }"
                    class="block px-4 py-2 hover:bg-gray-100"
                  >
                    <strong class="block text-gray-900">{{ `#${hashtag.slug}` }}</strong>
                    <span class="block text-gray-600">{{ `${hashtag.total_posts} illustrations` }}</span>
                  </router-link>
                  <div class="mt-4 px-4 text-sm text-gray-600">
                    <template v-if="isAuthenticated">
                      <button class="inline-block hover:text-primary" @click="$bus.$emit('showFeedbackModal')">Send feedback</button><br/>
                    </template>
                    <a href="https://ko-fi.com/maverick504" target="_blank" class="inline-block hover:text-primary">Buy us a coffee</a>
                  </div>
                  <div class="mt-4 px-4 text-sm text-gray-600">
                    <a href="https://twitter.com/drawvania" target="_blank" class="inline-block mr-2 hover:text-primary">
                      <twitter-icon/>
                    </a>
                  </div>
                </div>
              </div>
            </affix>
          </no-ssr>
        </aside>
      </div>
    </div>
    <feedback-modal/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FeedbackModal from '@/components/modals/FeedbackModal.vue'
import { XIcon, TwitterIcon } from 'vue-feather-icons'

export default {
  components: {
    FeedbackModal,
    XIcon,
    TwitterIcon
  },

  props: {
    whiteBg: { type: Boolean, default: false, required: false }
  },

  data: function () {
    return {
      baseUrl: process.env.baseUrl,
      windowScrollX: 0,
      featuredHashtags: []
    }
  },

  computed: {
    ...mapGetters([ 'isAuthenticated' ])
  },

  mounted () {
    this.fetchFeaturedHashtags()
    window.addEventListener('scroll', this.onWindowScroll)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.onWindowScroll)
  },

  methods: {
    async fetchFeaturedHashtags () {
      const response = await this.$axios.get('/featured-hashtags')
      this.featuredHashtags = response.data
    },

    onWindowScroll () {
      this.windowScrollX = window.scrollX
    }
  }
}
</script>
