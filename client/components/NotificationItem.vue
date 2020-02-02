<template>
  <router-link
    :to="to"
    :class="{ 'opacity-50': notification.read_at }"
    class="flex bg-white p-2 hover:bg-gray-100"
    @click.native="markAsRead()">
    <div class="flex-initial flex-shrink-0 pr-2">
      <template v-if="notification.type === 'newFollower'">
        <avatar
          :user="notification.triggerer"
          size="12"/>
      </template>
      <template v-else>
        <img
          :src="icon.url"
          :alt="icon.alt"
          class="w-12 h-12 rounded"
          width="50"
          height="50"
        >
      </template>
    </div>
    <div class="flex-grow">
      <div class="flex items-center">
        <div
          v-if="notification.type !== 'newFollower'"
          class="inline-block">
          <router-link
            :to="{ name: 'users.show', params: { username: notification.triggerer.username } }"
            class="inline-block mr-2">
            <avatar
              :user="notification.triggerer"
              size="6"/>
          </router-link>
        </div><!--
     --><span class="text-gray-600">{{ notification.created_at | moment("from", "now") }}</span>
      </div>
      <div class="whitespace-normal text-gray-900 text-sm">
        <router-link
          :to="{ name: 'users.show', params: { username: notification.triggerer.username } }"
          class="text-primary">
          {{ `@${notification.triggerer.username}` }}
        </router-link> {{ suffix }} <div
          v-if="!notification.read_at"
          class="inline-block w-2 h-2 bg-primary rounded-full"
          title="New Notification"/>
      </div>
    </div>
  </router-link>
</template>

<script type="text/javascript">
import Avatar from '@/components/Avatar.vue'
import { HeartIcon } from 'vue-feather-icons'

export default {
  components: {
    Avatar,
    HeartIcon
  },

  props: {
    notification: { type: Object, required: true }
  },

  data: function () {
    return {
      busy: false
    }
  },

  computed: {
    to () {
      if(this.notification.entity_type === 'App/Models/Post') {
        return {
          name: 'posts.show',
          params: {
            id: this.notification.entity.id
          }
        }
      } else if(this.notification.entity_type === 'App/Models/PostComment') {
        return {
          name: 'posts.show',
          params: {
            id: this.notification.entity.post.id
          }
        }
      } else if(this.notification.type === 'newFollower') {
        return {
          name: 'users.show',
          params: {
            username: this.notification.triggerer.username
          }
        }
      }
    },

    icon () {
      switch (this.notification.entity_type) {
        case 'App/Models/Post':
          return {
            url: this.notification.entity.media[0].variations['50x50f'].url,
            alt: "Post's image"
          }
        case 'App/Models/PostComment':
          return {
            url: this.notification.entity.post.media[0].variations['50x50f'].url,
            alt: "Post's image"
          }
      }
    },

    suffix () {
      switch (this.notification.type) {
        case 'newLikeInPost':
          return 'liked your post.'
        case 'newLikeInPostComment':
            return `liked your comment: ${this.notification.entity.comment}.`
        case 'newRedrawOfPost':
          return 'redrawed your post.'
        case 'newCommentInPost':
          return `commented your post: ${this.notification.metadata.comment.comment}.`
        case 'newReplyToCommentInPost':
          return `replied to a conversation where you are participant: ${this.notification.metadata.comment.comment}.`
        case 'deletedCommentInPost':
          return 'deleted your comment.'
        case 'newFollower':
          return 'started following you.'
      }
    }
  },

  methods: {
    async markAsRead () {
      if(this.busy) {
        return
      }

      this.busy = true

      await this.$axios.post(`/notifications/${this.notification.id}/mark-as-read`)

      this.busy = false
    }
  }
}
</script>
