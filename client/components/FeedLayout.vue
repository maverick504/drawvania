<template>
  <div class="flex justify-center bg-white" style="min-height: calc(100vh - 57px);">
    <div class="flex">
      <aside class="flex-initial border-r" style="min-width: 260px;">
        <no-ssr>
          <affix relative-element-selector="#content" :offset="{ top: 57, bottom: 0 }" :scroll-affix="true" style="width: 260px;">
            <div class="py-4">
              <div class="mx-4 mb-2 text-sm font-bold uppercase">Activity</div>
              <router-link :to="{ name: 'feed.global' }" class="flex items-center px-4 py-2" exact-active-class="border-l-4 border-primary">
                Recent works
              </router-link>
              <router-link v-if="isAuthenticated" :to="{ name: 'feed.followings' }" class="flex items-center px-4 py-2" exact-active-class="border-l-4 border-primary">
                Followings works
              </router-link>
              <template v-if="isAuthenticated">
                <div class="mx-4 my-2 text-sm font-bold uppercase">Lists Activity</div>
                <a href="#" class="flex items-center px-4 py-2" active-class="border-l-4 border-primary">
                  Manga
                </a>
                <a href="#" class="flex items-center px-4 py-2" active-class="border-l-4 border-primary">
                  Newbies
                </a>
              </template>
            </div>
          </affix>
        </no-ssr>
      </aside>
      <main id="content" class="flex-grow bg-gray-100" style="width: 576px;">
        <slot/>
      </main>
      <aside class="flex-initial border-l" style="min-width: 260px;">
        <no-ssr>
          <affix relative-element-selector="#content" :offset="{ top: 57, bottom: 0 }" :scroll-affix="true" style="width: 260px;">
            <div class="py-4">
              <div class="mx-4 mb-2 text-sm font-bold uppercase">Active Contests</div>
              <!--
              <div class="text-gray-600 text-center px-4 py-2">
                No active contests now...
              </div>
              -->
              <a href="#" class="block mx-4 mb-2">
                <img src="https://via.placeholder.com/280x120" class="w-full h-auto">
              </a>
              <a href="#" class="block mx-4">
                <img src="https://via.placeholder.com/280x120" class="w-full h-auto">
              </a>
            </div>
            <div class="mb-4 text-center text-sm text-gray-600">
              <a href="#" class="whitespace-no-wrap mr-2">Support/Premium</a>
              <a href="#" class="whitespace-no-wrap mr-2">Supporters</a>
              <a href="#" class="whitespace-no-wrap mr-2">Privacy Policy</a>
              <a href="#" class="whitespace-no-wrap mr-2">Terms of Use</a>
              <a href="#" class="whitespace-no-wrap mr-2">Feedback</a>
            </div>
          </affix>
        </no-ssr>
      </aside>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([ 'isAuthenticated' ])
  }
}
</script>
