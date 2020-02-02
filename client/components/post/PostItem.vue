<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-lg mb-4">
    <div class="flex text-sm px-4 my-4">
      <div class="flex-initial py-px pr-2">
        <router-link :to="{ name: 'users.show', params: { username: post.author.username } }">
          <avatar :user="post.author" size="10"/>
        </router-link>
      </div>
      <div class="flex-grow">
        <div class="block">
          <router-link :to="{ name: 'users.show', params: { username: post.author.username } }" class="font-bold leading-none mr-1">
            {{ post.author.username }}
          </router-link><!--
       --><span v-if="post.author.upgraded_premium_at" class="inline-block bg-gold font-normal text-sm text-white px-2 rounded-full mr-1">premium</span><!--
       --><follow-button
            v-if="!isAuthenticated || loggedInUser.id !== post.author.id"
            :logged-in-user-is-follower.sync="post.author.logged_in_user_is_follower"
            :total-followers.sync="post.author.total_followers"
            :follow-endpoint="`/users/${post.author.username}/follow`"
            :unfollow-endpoint="`/users/${post.author.username}/unfollow`"
            class="mr-4"
          />
        </div>
        <div class="text-gray-600">
          <span>{{ post.date | moment("from", "now") }}</span>
          <template v-if="post.updated_at > post.date">
            &bull; <span>edited {{ post.updated_at | moment("from", "now") }}</span>
          </template>
        </div>
      </div>
      <div class="flex-initial pl-2">
        <t-dropdown
          :button-props="{
            baseClass: 'text-gray-600 hover:text-gray-900',
            defaultSizeClass: 'p-0'
          }"
          :visible-arrow="false"
          dropdown-class="w-48 bg-white border shadow-md py-2 z-10"
          placement="bottom-end"
        >
          <template slot="button-content">
            <more-horizontal-icon size="1.8x"/>
          </template>
          <ul>
            <li v-for="(item, index) in dropdownItems" :key="index">
              <template v-if="item.to">
                <router-link :to="item.to" :class="{ [`${item.extraClasses}`]: true }" class="block w-full text-left no-underline px-6 py-2" exact-active-class="text-primary">
                  {{ item.text }}
                </router-link>
              </template>
              <template v-else-if="item.onclick">
                <button :class="{ [`${item.extraClasses}`]: true }" class="block w-full text-left no-underline px-6 py-2" @click="item.onclick">
                  {{ item.text }}
                </button>
              </template>
              <template v-else>
                <div :class="{ [`${item.extraClasses}`]: true }" class="block no-underline px-6 py-2">
                  {{ item.text }}
                </div>
              </template>
            </li>
          </ul>
        </t-dropdown>
      </div>
    </div>
    <post-item-image :post="post"/>
    <div class="p-4">
      <div v-if="post.parentPost" class="flex items-center text-sm mb-4">
        <div class="flex-initial flex-shrink-0 pr-2">
          <router-link :to="{ name: 'posts.show', params: { id: post.parentPost.id } }">
            <img :src="post.parentPost.media[0].variations['50x50f'].url" class="w-10 h-10 rounded">
          </router-link>
        </div>
        <div class="flex-grow text-sm">
          <router-link :to="{ name: 'posts.show', params: { id: post.parentPost.id } }">
            redraw to a post of: <b>{{ post.parentPost.author.username }}</b>
          </router-link>
        </div>
      </div>
      <div v-if="post.completedChallengeRelationship" class="flex items-center text-sm mb-4">
        <div class="flex-initial flex-shrink-0 pr-2">
          <router-link :to="{ name: 'challenges.show', params: { id: post.completedChallengeRelationship.challenge.id } }">
            <img src="~/assets/img/challenge_icon.png" width="50" height="50" class="w-10 h-10 rounded">
          </router-link>
        </div>
        <div class="flex-grow text-sm">
          <router-link :to="{ name: 'challenges.show', params: { id: post.completedChallengeRelationship.challenge.id } }">
            challenge overcome: <b>{{ post.completedChallengeRelationship.challenge.title }}</b>
          </router-link>
        </div>
      </div>
      <p v-if="post.description" v-html="descriptionHtml" class="mb-4"></p>
      <div class="block">
        <button
          v-if="post.total_likes > 0"
          class="inline-block text-primary mb-4"
          type="button"
          @click.prevent="likesClicked">
          {{ post.total_likes }} likes
        </button>
        <button
          v-if="post.total_comments > 0"
          class="inline-block text-primary mb-4 float-right ml-4"
          type="button"
          @click.prevent="commentsClicked">
          {{ post.total_comments }} comments
        </button>
        <button
          v-if="post.total_direct_children_posts > 0"
          class="inline-block text-primary mb-4 float-right"
          type="button"
          @click.prevent="redrawsClicked">
          {{ post.total_direct_children_posts }} redraws
        </button>
      </div>
      <div class="flex">
        <like-button
          :logged-in-user-liked.sync="post.logged_in_user_liked"
          :total-likes.sync="post.total_likes"
          :like-endpoint="`/posts/${post.id}/like`"
          :unlike-endpoint="`/posts/${post.id}/unlike`"
          class="mr-4"
        /><!--
     --><button class="inline-block mr-4" @click="commentButtonClicked">
          <message-circle-icon size="2x" class="text-primary"/>
        </button><!--
     --><button class="inline-block" @click="redrawButtonClicked">
          <edit-3-icon size="2x" class="text-primary"/>
        </button>
      </div>
    </div>
    <comments-footer v-if="showComments" :post="post"/>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'
import FollowButton from '@/components/FollowButton.vue'
import PostItemImage from '@/components/post/PostItemImage.vue'
import LikeButton from '@/components/LikeButton.vue'
import CommentsFooter from '@/components/post/comments/CommentsFooter.vue'
import { MoreHorizontalIcon, MessageCircleIcon, Edit3Icon } from 'vue-feather-icons'

export default {
  components: {
    Avatar,
    FollowButton,
    PostItemImage,
    LikeButton,
    CommentsFooter,
    MoreHorizontalIcon,
    MessageCircleIcon,
    Edit3Icon
  },

  props: {
    post: { type: Object, required: true }
  },

  data: function () {
    return {
      showComments: false
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),

    descriptionHtml () {
      return this.post.description.replace(/#([a-z][a-z0-9]*)(?=\s|$)/gi,'<a class="text-primary" href="/explore/hashtags/$1">#$1</a>')
    },

    dropdownItems () {
      var items = []

      if(this.$route.name !== 'posts.show' || parseInt(this.$route.params.id) !== this.post.id) {
        items.push({
          to: { name: 'posts.show', params: { id: this.post.id } },
          text: 'Go to post',
          extraClasses: 'hover:text-primary'
        })
      }

      if(this.isAuthenticated && this.loggedInUser.id === this.post.author_id) {
        items.push({
          onclick: () => {
            this.$bus.$emit('editPost', this.post.id)
          },
          text: 'Edit post',
          extraClasses: 'hover:text-primary'
        })
        items.push({
          onclick: this.askDelete,
          text: 'Delete post',
          extraClasses: 'hover:text-red'
        })
      }

      if(this.isAuthenticated && this.loggedInUser.id !== this.post.author_id) {
        items.push({
          text: 'Report post',
          extraClasses: 'hover:text-red'
        })
      }

      return items
    }
  },

  methods: {
    likesClicked () {
      this.$bus.$emit('showLikesModal', `/posts/${this.post.id}/likes`)
    },

    commentsClicked () {
      if(!this.isAuthenticated) {
        this.$bus.$emit('showLoginModal')
        return
      }

      this.showComments = this.showComments ? false : true
    },

    redrawsClicked () {
      this.$bus.$emit('showRedrawsModal', `/posts/${this.post.id}/redraws`)
    },

    commentButtonClicked () {
      if(!this.isAuthenticated) {
        this.$bus.$emit('showLoginModal')
        return
      }

      this.showComments = this.showComments ? false : true
    },

    redrawButtonClicked () {
      if(!this.isAuthenticated) {
        this.$bus.$emit('showLoginModal')
        return
      }

      this.$bus.$emit('createPost', { parentPostId: this.post.id })
    },

    async askDelete () {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "The post will be permanently deleted!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      })

      if (result.value) {
        // Delete the post
        await this.$axios.delete(`posts/${this.post.id}`)

        // Redirect to home.
        window.location.replace('/')
      }
    }
  }
}
</script>
