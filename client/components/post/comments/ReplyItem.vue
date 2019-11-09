<template>
  <div class="comment-item">
    <div class="comment-avatar-wrap">
      <a href="#">
        <avatar :user="comment.author" size="sm"/>
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
          <button v-if="comment.author_id === loggedInUser.id" class="btn btn-link" @click.prevent="startEditing">
            Edit
          </button>
          <button v-if="post.author_id === loggedInUser.id || comment.author_id === loggedInUser.id" class="btn btn-link" @click.prevent="askDelete">
            Delete
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar
  },

  props: {
    post: { type: Object, required: true },
    comment: { type: Object, required: true }
  },

  data: function () {
    return {
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
          this.$emit('replyDeleted', this.comment.id)
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
