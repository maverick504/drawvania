<template>
  <feed-layout>
    <div class="fixed bg-white p-4 font-bold text-lg border-b shadow" style="margin: 0 1px; width: 574px; top: 57px;">
      Followings works
    </div>
    <div style="height: 59px;"></div>
    <div class="p-4">
      <post-infinite-scroll endpoint="feed/followings">
        <template slot="empty-state">
          <div class="text-center py-8">
            <users-icon size="4x" class="mx-auto"/>
            <p class="mt-2">Start following the users you like the most and you will see their new posts here.</p>
            <router-link :to="{ name: 'feed.global' }" class="inline-block text-primary mt-2">Explore recent posts</router-link>
          </div>
        </template>
      </post-infinite-scroll>
    </div>
  </feed-layout>
</template>

<script>
import FeedLayout from '@/components/FeedLayout.vue'
import PostInfiniteScroll from '@/components/PostInfiniteScroll.vue'
import { UsersIcon } from 'vue-feather-icons'

export default {
  middleware: 'auth',

  components: {
    FeedLayout,
    PostInfiniteScroll,
    UsersIcon
  }
}
</script>
