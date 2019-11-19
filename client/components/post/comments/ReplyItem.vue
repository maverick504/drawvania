<template>
  <div class="flex mt-4">
    <div class="flex-shrink-0">
      <router-link :to="{ name: 'users.show', params: { username: comment.author.username } }" class="block mr-2">
        <avatar :user="comment.author" size="8"/>
      </router-link>
    </div>
    <div class="flex-grow">
      <div v-show="!editing">
        <div class="block">
          <router-link :to="{ name: 'users.show', params: { username: comment.author.username } }" class="font-bold mr-1">
            {{ comment.author.username }}
          </router-link>
          <span class="inline-block text-sm gray-600">
            {{ comment.created_at | moment("from", "now") }}
            <abbr v-if="comment.updated_at > comment.created_at" :title="`Edited on ${comment.updated_at}`">(edited)</abbr>
          </span>
        </div>
        <p>{{ comment.comment }}</p>
      </div>
      <t-input
        v-if="editing"
        ref="editCommentInput"
        :status="error ? 'error' : null"
        baseClass="w-full border-b-2 border-gray-200 focus:border-primary"
        defaultSizeClass="px-2 pt-1 pb-1"
        errorStatusClass="border-danger focus:border-danger"
        v-model="newContent"
        placeholder="Write a reply to this conversation..."
        autocomplete="off"
        @keyup.enter="confirmEditing"
      />
      <div v-if="error" class="text-danger text-sm">
        {{ error }}
      </div>
      <div class="text-sm pt-1">
        <template v-if="editing">
          <button class="text-primary mr-2" @click.prevent="cancelEditing()">
            Cancel
          </button>
        </template>
        <template v-else-if="isAuthenticated">
          <button v-if="comment.author_id === loggedInUser.id" class="text-primary mr-2" @click.prevent="editButtonClicked">
            Edit
          </button>
          <button v-if="post.author_id === loggedInUser.id || comment.author_id === loggedInUser.id" class="text-primary mr-2" @click.prevent="deleteButtonClicked">
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
    ...mapGetters([ 'isAuthenticated', 'loggedInUser' ]),
  },

  methods: {
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
