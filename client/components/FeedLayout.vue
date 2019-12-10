<template>
  <div>
    <div
      class="flex justify-center bg-white"
      style="min-height: calc(100vh - 57px);">
      <div class="flex">
        <aside
          class="flex-initial border-r z-30"
          style="min-width: 254px;">
          <no-ssr>
            <affix
              :offset="{ top: 57, bottom: 0 }"
              :scroll-affix="true"
              relative-element-selector="#content"
              style="width: 254px;">
              <div class="py-4">
                <div class="mx-4 mb-2 text-sm font-bold uppercase">Explore</div>
                <router-link
                  :to="{ name: 'feed.global' }"
                  class="block px-4 py-2"
                  exact-active-class="border-l-4 border-primary">
                  Recent works
                </router-link>
                <router-link
                  v-if="isAuthenticated"
                  :to="{ name: 'feed.followings' }"
                  class="block px-4 py-2"
                  exact-active-class="border-l-4 border-primary">
                  Followings works
                </router-link>
                <!--
                <template v-if="isAuthenticated">
                  <div class="mx-4 my-2 text-sm font-bold uppercase">Lists Activity</div>
                  <a href="#" class="block px-4 py-2" active-class="border-l-4 border-primary">
                    Manga
                  </a>
                  <a href="#" class="block px-4 py-2" active-class="border-l-4 border-primary">
                    Newbies
                  </a>
                </template>
                -->
              </div>
            </affix>
          </no-ssr>
        </aside>
        <main
          id="content"
          class="flex-grow bg-gray-100"
          style="width: 560px;">
          <slot/>
        </main>
        <aside
          class="flex-initial border-l z-30"
          style="min-width: 254px;">
          <no-ssr>
            <affix
              :offset="{ top: 57, bottom: 0 }"
              :scroll-affix="true"
              relative-element-selector="#content"
              style="width: 254px;">
              <div class="py-4">
                <div class="mx-4 mb-2 text-sm font-bold uppercase">Featured hashtags</div>
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
                  <button v-if="isAuthenticated" class="block hover:text-primary" @click="$bus.$emit('showFeedbackModal')">Send feedback</button>
                  <!--
                  <a href="#" target="_blank" class="block hover:text-primary">Support us on Patreon</a>
                  <a href="#" target="_blank" class="block hover:text-primary">Patreon backers</a>
                  -->
                </div>
                <div class="mt-4 px-4 text-sm text-gray-600">
                  <a href="https://twitter.com/drawvania" target="_blank" class="inline-block mr-2 hover:text-primary">
                    <twitter-icon/>
                  </a>
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
import { TwitterIcon } from 'vue-feather-icons'

export default {
  components: {
    FeedbackModal,
    TwitterIcon
  },

  data: function () {
    return {
      baseUrl: process.env.baseUrl,
      featuredHashtags: []
    }
  },

  computed: {
    ...mapGetters([ 'isAuthenticated' ])
  },

  mounted () {
    this.fetchFeaturedHashtags()
  },

  methods: {
    async fetchFeaturedHashtags () {
      const response = await this.$axios.get('/featured-hashtags')
      this.featuredHashtags = response.data
    }
  }
}
</script>
