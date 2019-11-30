<template>
  <div class="border-t">
    <div 
      v-if="loading && comments.length === 0" 
      class="text-primary text-center py-5">
      <div 
        class="spinner" 
        role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <template v-else>
      <comment-form 
        v-if="isAuthenticated" 
        :post="post" 
        @commentPosted="onCommentPosted"/>
      <template v-if="comments.length > 0">
        <div class="mt-4">
          <comment-item
            v-for="comment in comments"
            :key="comment.id"
            :post="post"
            :comment="comment"
            @commentDeleted="onCommentDeleted"
          />
        </div>
        <div 
          v-if="loading" 
          class="text-primary text-center py-5">
          <div 
            class="spinner" 
            role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div class="flex border-t border-gray-300 p-4">
          <div class="flex-grow">
            <button 
              v-if="page < lastPage" 
              type="button" 
              class="text-primary" 
              @click="loadNextPage()">Show more comments</button>
          </div>
          <div class="flex-initial">
            <span class="text-gray-600">{{ comments.length }} of {{ total }}</span>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentForm from '@/components/post/comments/CommentForm.vue'
import CommentItem from '@/components/post/comments/CommentItem.vue'

export default {
  components: {
    CommentForm,
    CommentItem
  },

  props: {
    post: { type: Object, required: true }
  },

  data: function () {
    return {
      comments: [],
      loading: false,
      page: 1,
      lastPage: 2,
      total: 0
    }
  },

  computed: {
    ...mapGetters([ 'isAuthenticated', 'loggedInUser' ]),
  },

  mounted () {
    this.loadPage()
  },

  methods: {
    async loadNextPage () {
      this.page++
      await this.loadPage()
    },

    async loadPage () {
      if(this.loading) {
        return
      }

      this.loading = true

      const response = await this.$axios.get(`posts/${this.post.id}/comments?page=${this.page}`)

      this.comments = this.comments.concat(response.data.data)
      this.lastPage = response.data.lastPage
      this.total = response.data.total

      this.loading = false
    },

    onCommentPosted (comment) {
      this.comments.unshift(comment)
      this.total++
    },

    onCommentDeleted (id) {
      for(var i=0; i<this.comments.length; i++) {
        if(this.comments[i].id === id) {
          this.comments.splice(i, 1)
        }
      }

      this.total--
    }
  }
}
</script>
