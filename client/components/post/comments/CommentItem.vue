<template>
  <div class="comment-item">
    <div class="comment-avatar-wrap">
      <a href="#">
        <avatar :user="comment.author" size="md"/>
      </a>
    </div>
    <div class="comment-body">
      <div v-show="!editing">
        <div class="comment-header">
          <a href="#" class="comment-header-username">{{ '@' + comment.author.username }}</a> &bull;
          <span v-if="comment.updated_at > comment.created_at"><abbr :title="`Originally created on ${comment.created_at}`">edited</abbr> {{ comment.updated_at | moment("from", "now") }}</span>
          <span v-else class="comment-header-date">{{ comment.created_at | moment("from", "now") }}</span>
        </div>
        <div class="comment-content">
          {{ comment.comment }}
        </div>
      </div>
      <div v-if="editing" class="comment-edit-box">
        <b-form-input
          ref="editCommentInput"
          v-model="newContent"
          placeholder="Write a comment about this..."
          autocomplete="off"
          @keyup.enter="confirmEditing"
        />
      </div>
      <div v-if="error" class="comment-error-wrap form-text text-danger">
        {{ error }}
      </div>
      <div class="comment-action-box">
        <template v-if="editing">
          <a href="#" @click.prevent="cancelEditing">Cancel</a>
        </template>
        <template v-else-if="isAuthenticated">
          <button v-if="comment.replies.length === 0 && !showingReplyForm" class="btn btn-link" @click.prevent="showingReplyForm = true">
            Reply
          </button><!--
       --><button v-if="comment.author_id === loggedInUser.id" class="btn btn-link" @click.prevent="startEditing">
            Edit
          </button><!--
       --><button v-if="post.author_id === loggedInUser.id || comment.author_id === loggedInUser.id" class="btn btn-link" @click.prevent="askDelete">
            Delete
          </button>
        </template>
      </div>
      <div class="comment-replies">
        <reply-item
          v-for="(reply, index) in comment.replies"
          :key="index"
          :post="post"
          :comment="reply"
          @replyDeleted="onReplyDeleted"
        />
        <button v-if="comment.replies.length > 0 && !showingReplyForm && isAuthenticated" class="btn btn-link" @click.prevent="showingReplyForm = true">
          Reply to this conversation
        </button>
        <reply-form
          v-if="showingReplyForm"
          :parentComment="comment"
          @cancelled="showingReplyForm = false"
          @replyPosted="onReplyPosted"
        />
      </div>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'
import ReplyItem from '@/components/post/comments/ReplyItem.vue'
import ReplyForm from '@/components/post/comments/ReplyForm.vue'

export default {
  components: {
    Avatar,
    ReplyItem,
    ReplyForm
  },

  props: {
    post: { type: Object, required: true },
    comment: { type: Object, required: true }
  },

  data: function () {
    return {
      showingReplyForm: false,
      editing: false,
      newContent: '',
      busy: false,
      error: null
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },

  methods: {
    startEditing () {
      this.newContent = this.comment.comment
      this.editing = true

      this.$nextTick(() => {
        this.$refs.editCommentInput.$el.focus()
      });
    },

    async confirmEditing () {
      if(this.busy) {
        return
      }

      this.error = ''
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
      this.showingReplyForm = false

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

    async askDelete () {
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

<style lang="scss">
.comment-item {
  margin: 8px 0;
  display: flex;
  flex-direction: row;
  .comment-avatar-wrap {
    flex-grow: 0;
    margin-right: 12px;
    .avatar {
      display: block;
    }
  }
  .comment-body {
    flex-grow: 1;
    padding: 1px 0;
    .comment-header {
      margin-bottom: 4px;
      .comment-header-username {
        color: #343a40;
        font-weight: bold;
        text-decoration: none;
      }
    }
    .comment-content {
      margin-bottom: 4px;
    }
    .comment-edit-box {
      .form-control {
        padding-left: 0;
        padding-right: 0;
        border: none;
        box-shadow: none;
      }
    }
    .comment-error-wrap {
      font-size: 0.9rem;
    }
    .btn-link {
      font-size: 0.9rem;
      padding: 0;
      margin-right: 4px;
    }
  }
}
</style>
