<template>
  <div class="comment-form">
    <div class="comment-form-avatar-wrap">
      <avatar :user="loggedInUser" size="md"/>
    </div>
    <div class="comment-form-body">
      <b-form-input
        v-model="content"
        placeholder="Write a comment about this..."
        autocomplete="off"
        @keyup.enter="submit"
      />
      <span v-if="error" class="form-text text-danger">
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
    ...mapGetters(['loggedInUser'])
  },

  methods: {
    async submit () {
      if(this.busy) {
        return
      }

      this.error = ''
      this.busy = true

      try {
        const response = await this.$axios.post('comments', {
          post_id: this.post.id,
          comment: this.content
        })
        const comment = response.data.data
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

<style lang="scss">
.comment-form {
  width: 100%;
  display: flex;
  flex-direction: row;
  .comment-form-avatar-wrap {
    flex-grow: 0;
    margin-right: 12px;
    .avatar {
      display: block;
    }
  }
  .comment-form-body {
    flex-grow: 1;
    padding: 1px 0;
  }
}
</style>
