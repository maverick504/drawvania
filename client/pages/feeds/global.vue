<template>
  <feed-layout>
    <div
      class="fixed bg-white p-4 font-bold text-lg border-b shadow z-20" 
      style="margin: 0 1px; width: 574px; top: 57px;">
      Recent works
    </div>
    <div style="height: 59px;"/>
    <div class="p-4">
      <post-infinite-scroll endpoint="feed/global"/>
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
