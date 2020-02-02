<template>
  <feed-layout>
    <template slot="context-header">
      {{ `#${$route.params.slug}` }}
    </template>
    <div class="p-4">
      <post-infinite-scroll :endpoint="`explore/hashtags/${$route.params.slug}`"/>
    </div>
  </feed-layout>
</template>

<script>
import FeedLayout from '@/components/FeedLayout.vue'
import PostInfiniteScroll from '@/components/PostInfiniteScroll.vue'

export default {
  components: {
    FeedLayout,
    PostInfiniteScroll
  }
}
</script>
