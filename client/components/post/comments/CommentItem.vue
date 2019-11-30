<template>
  <div class="flex px-4 mb-4">
    <div class="flex-shrink-0">
      <router-link 
        :to="{ name: 'users.show', params: { username: comment.author.username } }" 
        class="block mr-2">
        <avatar 
          :user="comment.author" 
          size="10"/>
      </router-link>
    </div>
    <div class="flex-grow">
      <div v-show="!editing">
        <div class="block">
          <router-link 
            :to="{ name: 'users.show', params: { username: comment.author.username } }" 
            class="font-bold mr-1">
            {{ comment.author.username }}
          </router-link>
          <span class="inline-block text-sm gray-600">
            {{ comment.created_at | moment("from", "now") }}
            <abbr 
              v-if="comment.updated_at > comment.created_at" 
              :title="`Edited on ${comment.updated_at}`">(edited)</abbr>
          </span>
        </div>
        <div class="flex items-center">
          <p class="flex-grow">
            {{ comment.comment }}
          </p>
          <div class="flex-initial whitespace-no-wrap pl-1">
            <like-button
              :logged-in-user-liked.sync="comment.logged_in_user_liked"
              :total-likes.sync="comment.total_likes"
              :like-endpoint="`/comments/${comment.id}/like`"
              :unlike-endpoint="`/comments/${comment.id}/unlike`"
              size="1x"
              class="align-middle"
            /><!--
         --><span class="align-middle text-sm text-red ml-1">{{ comment.total_likes }}</span>
          </div>
        </div>
      </div>
      <t-input
        v-if="editing"
        ref="editCommentInput"
        :status="error ? 'error' : null"
        v-model="newContent"
        base-class="w-full border-b-2 border-gray-200 focus:border-primary"
        default-size-class="px-2 pt-2 pb-1"
        error-status-class="border-danger focus:border-danger"
        placeholder="Write a comment about this..."
        autocomplete="off"
        @keyup.enter="confirmEditing"
      />
      <div 
        v-if="error" 
        class="text-danger text-sm">
        {{ error }}
      </div>
      <div class="text-sm pt-1">
        <template v-if="editing">
          <button 
            class="text-primary mr-2" 
            @click.prevent="cancelEditing()">
            Cancel
          </button>
        </template>
        <template v-else-if="isAuthenticated">
          <button 
            v-if="comment.replies.length === 0 && !showReplyForm" 
            class="text-primary mr-2" 
            @click.prevent="replyButtonClicked">
            Reply
          </button><!--
       --><button 
v-if="comment.author_id === loggedInUser.id" 
class="text-primary mr-2" 
@click.prevent="editButtonClicked">
            Edit
          </button><!--
       --><button 
v-if="post.author_id === loggedInUser.id || comment.author_id === loggedInUser.id" 
class="text-primary mr-2" 
@click.prevent="deleteButtonClicked">
            Delete
          </button>
        </template>
      </div>
      <div 
        v-if="comment.replies.length > 0" 
        class="mt-4">
        <reply-item
          v-for="reply in comment.replies"
          :key="reply.id"
          :post="post"
          :comment="reply"
          @replyDeleted="onReplyDeleted"
        />
      </div>
      <button 
        v-if="comment.replies.length > 0 && !showReplyForm && isAuthenticated" 
        class="text-primary text-sm mt-4" 
        @click.prevent="replyButtonClicked">
        Reply to this conversation
      </button>
      <reply-form
        v-if="showReplyForm"
        :parent-comment="comment"
        class="mt-4"
        @cancelled="showReplyForm = false"
        @replyPosted="onReplyPosted"
      />
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'
import LikeButton from '@/components/LikeButton.vue'
import ReplyItem from '@/components/post/comments/ReplyItem.vue'
import ReplyForm from '@/components/post/comments/ReplyForm.vue'

export default {
  components: {
    Avatar,
    LikeButton,
    ReplyItem,
    ReplyForm
  },

  props: {
    post: { type: Object, required: true },
    comment: { type: Object, required: true }
  },

  data: function () {
    return {
      showReplyForm: false,
      editing: false,
      newContent: '',
      busy: false,
      error: null
    }
  },

  computed: {
    ...mapGetters([ 'isAuthenticated', 'loggedInUser' ]),
  },

  methods: {
    replyButtonClicked () {
      this.showReplyForm = true
    },

    editButtonClicked () {
      this.startEditing()
    },

    startEditing () {
      this.newContent = this.comment.comment
      this.error = null
      this.editing = true

      this.$nextTick(() => {
        this.$refs.editCommentInput.$el.focus()
      });
    },

    async confirmEditing () {
      if(this.busy) {
        return
      }

      this.error = null
      this.busy = true

      try {
        const response = await this.$axios.patch(`comments/${this.comment.id}`, {
          comment: this.newContent
        })

        this.comment.comment = response.data.data.comment
        this.comment.updated_at = response.data.data.updated_at

        this.editing = false
      } catch (e) {
        if(e.response.data.message !== undefined) {
          this.error = e.response.data.message
        } else if(e.response.data.length > 0) {
          this.error = e.response.data[0].message
        } else {
          this.error = 'Something went wrong, please try again.'
        }
      }

      this.busy = false
    },

    cancelEditing ()  {
      this.error = ''
      this.editing = false
    },

    onReplyPosted (reply) {
      this.showReplyForm = false

      this.comment.replies.push(reply)
      this.comment.total_replies++
    },

    onReplyDeleted (id) {
      for(var i=0; i<this.comment.replies.length; i++) {
        if(this.comment.replies[i].id === id) {
          this.comment.replies.splice(i, 1)
        }
      }

      this.comment.total_replies--
    },

    async deleteButtonClicked () {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "The comment will be permanently deleted!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      })

      if (result.value) {
        // Try to delete the comment
        try {
          await this.$axios.delete(`comments/${this.comment.id}`)
          this.$emit('commentDeleted', this.comment.id)
        } catch (e) {
          if(e.response.data.message !== undefined) {
            this.error = e.response.data.message
          } else if(e.response.data.length > 0) {
            this.error = e.response.data[0].message
          } else {
            this.error = 'Something went wrong, please try again.'
          }
        }
      }
    }
  }
}
</script>
