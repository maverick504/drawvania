<template>
  <div class="flex pb-4">
    <div class="flex-shrink-0">
      <avatar 
        :user="loggedInUser" 
        size="8" 
        class="mr-2"/>
    </div>
    <div class="flex-grow">
      <t-input
        ref="commentInput"
        :status="error ? 'error' : null"
        v-model="content"
        base-class="w-full border-b-2 border-gray-200 focus:border-primary"
        default-size-class="px-2 pt-1 pb-1"
        error-status-class="border-danger focus:border-danger"
        placeholder="Write a reply to this conversation..."
        autocomplete="off"
        @keyup.enter="submit"
      />
      <span 
        v-if="error" 
        class="text-danger text-sm">
        {{ error }}
      </span>
      <div class="text-sm pt-1">
        <button 
          class="text-primary mr-2" 
          @click.prevent="cancel()">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar
  },

  props: {
    parentComment: { type: Object, required: true }
  },

  data: function () {
    return {
      content: '',
      busy: false,
      error: null
    }
  },

  computed: {
    ...mapGetters([ 'loggedInUser' ]),
  },

  mounted () {
    this.$nextTick(() => {
      this.$refs.commentInput.$el.focus()
    })
  },

  methods: {
    async submit () {
      if(this.busy) {
        return
      }

      this.error = null
      this.busy = true

      try {
        const response = await this.$axios.post(`comments/${this.parentComment.id}/reply`, {
          comment: this.content
        })
        const reply = response.data.data
        comment.total_likes = 0
        comment.logged_in_user_liked = false

        this.$emit('replyPosted', reply)
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

    cancel () {
      this.$emit('cancelled')
    }
  }
}
</script>
