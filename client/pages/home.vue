<template>
  <div>
    <to-top-button/>
    <post-infinite-scroll endpoint="feed/global"/>
  </div>
</template>

<script>
import ToTopButton from '@/components/ToTopButton.vue'
import PostInfiniteScroll from '@/components/PostInfiniteScroll.vue'

export default {
  components: {
    ToTopButton,
    PostInfiniteScroll
  }
}
</script>
