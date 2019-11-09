<template>
  <div>
    <div v-if="loading && comments.length === 0" class="card-footer bg-white py-5 text-center text-primary">
      <div class="spinner-grow" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <template v-else>
      <div v-if="isAuthenticated" class="card-footer">
        <comment-form
          :post="post"
          @commentPosted="onCommentPosted"
        />
      </div>
      <template v-if="comments.length > 0">
        <div class="card-footer bg-white">
          <comment-item
            v-for="(comment, index) in comments"
            :key="index" :post="post"
            :comment="comment"
            @commentDeleted="onCommentDeleted"
          />
        </div>
        <div v-if="loading" class="card-footer bg-white py-5 text-center text-primary">
          <div class="spinner-grow" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div v-else class="card-footer d-flex">
          <a v-if="page < lastPage" href="#" @click.prevent="loadNextPage()">Show more comments</a>
          <span class="ml-auto">{{ comments.length }} of {{ total }}</span>
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
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
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
