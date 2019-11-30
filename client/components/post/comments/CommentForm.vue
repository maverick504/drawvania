<template>
  <div class="flex p-4">
    <div class="flex-shrink-0">
      <avatar
        :user="loggedInUser"
        size="10"
        class="mr-2"/>
    </div>
    <div class="flex-grow">
      <t-input
        :status="error ? 'error' : null"
        v-model="content"
        base-class="w-full border-b-2 border-gray-200 focus:border-primary"
        default-size-class="px-2 py-2"
        error-status-class="border-danger focus:border-danger"
        placeholder="Write a comment about this..."
        autocomplete="off"
        @keyup.enter="submit"
      />
      <span
        v-if="error"
        class="text-danger text-sm">
        {{ error }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'
import Form from '@/plugins/adonis-form'

export default {
  components: {
    Avatar
  },

  props: {
    post: { type: Object, required: true }
  },

  data: function () {
    return {
      content: '',
      busy: false,
      error: null
    }
  },

  computed: {
    ...mapGetters([ 'loggedInUser' ])
  },

  methods: {
    async submit () {
      if(this.busy) {
        return
      }

      this.error = null
      this.busy = true

      try {
        const response = await this.$axios.post('comments', {
          post_id: this.post.id,
          comment: this.content
        })

        const comment = response.data.data
        comment.total_likes = 0
        comment.logged_in_user_liked = false
        comment.replies = []

        this.$emit('commentPosted', comment)

        this.content = ''
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
    }
  }
}
</script>
