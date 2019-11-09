<template>
  <div class="reply-form">
    <div class="reply-form-avatar-wrap">
      <avatar :user="loggedInUser" size="sm"/>
    </div>
    <div class="reply-form-body">
      <b-form-input
        ref="commentInput"
        v-model="comment"
        placeholder="Write a reply to this conversation..."
        autocomplete="off"
        @keyup.enter="submit"
      />
      <div v-if="error" class="comment-error-wrap form-text text-danger">
        {{ error }}
      </div>
      <button class="btn btn-link" @click.prevent="cancel">
        Cancel
      </button>
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
      comment: '',
      busy: false,
      error: null
    }
  },

  computed: {
    ...mapGetters(['loggedInUser']),
  },

  mounted () {
    this.$refs.commentInput.$el.focus()
  },

  methods: {
    async submit () {
      if(this.busy) {
        return
      }

      this.error = ''
      this.busy = true

      try {
        const response = await this.$axios.post(`comments/${this.parentComment.id}/reply`, {
          comment: this.comment
        })
        const reply = response.data.data

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

<style lang="scss">
.reply-form {
  margin-top: 8px;
  width: 100%;
  display: flex;
  flex-direction: row;
  .reply-form-avatar-wrap {
    flex-grow: 0;
    margin-right: 12px;
    .avatar {
      display: block;
    }
  }
  .reply-form-body {
    flex-grow: 1;
    padding: 1px 0;
    .form-control {
      padding: 0;
      height: 32px;
      border: none;
      box-shadow: none;
    }
  }
}
</style>
