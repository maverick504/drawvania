<template>
  <div>
    <div class="card">
      <div class="card-header p-0">
        <div style="display: flex; flex-direction: row; align-items: center; padding: 8px 16px;">
          <div style="flex-grow: 0; padding-right: 8px;">
            <a href="#">
              <avatar :user="post.author" size="md" class="d-block"/>
            </a>
          </div>
          <div style="flex-grow: 1;">
            <div style="display: block;">
              <a href="#" class="text-dark" style="font-weight: bold; text-decoration: none;">
                {{ '@' + post.author.username }}
              </a>
            </div>
            <div style="display: block; font-size: 0.9rem;">
              <span>{{ post.date | moment("from", "now") }}</span>
              &bull;
              <span v-if="post.updated_at > post.date">edited {{ post.updated_at | moment("from", "now") }}</span>
            </div>
          </div>
          <div v-if="dropdownItems.length > 0" style="flex-grow: 0; padding-left: 8px;">
            <b-dropdown right variant="link" toggle-class="p-2" style="margin-right: -8px;" no-caret>
              <template slot="button-content">
                <more-horizontal-icon/>
              </template>
              <b-dropdown-item
                v-for="(item, index) in dropdownItems"
                :key="index"
                :to="item.to"
                @click="item.onclick"
                :variant="item.variant || 'default'"
              >
                {{ item.text }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
        <div v-if="post.parentPost" style="display: flex; flex-direction: row; align-items: center; padding-bottom: 8px;">
          <div style="flex-grow: 0; padding-left: 16px; padding-right: 8px;">
            <router-link :to="{ name: 'posts.show', params: { id: post.parentPost.id } }">
              <img style="width: 40px; height: 40px; border-radius: 6px;" :src="post.parentPost.media[0].variations['50x50'].url" alt="...">
            </router-link>
          </div>
          <div style="flex-grow: 1;">
            <div style="display: block;">
              <router-link :to="{ name: 'posts.show', params: { id: post.parentPost.id } }">
                redraw to a post of @{{ post.parentPost.author.username }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <v-image
        class="card-img"
        v-if="post.media && post.media.length > 0"
        :src="post.media[0].variations['600w'].url"
        :zoomSrc="post.media[0].variations['900w'].url"
        :ratioWidth="post.media[0].variations['600w'].width"
        :ratioHeight="post.media[0].variations['600w'].height"
      />
      <div class="card-body">
        <p v-if="post.description" style="margin: 0; margin-bottom: 16px;">
          {{ post.description }}
        </p>
        <a v-if="totalLikes > 0" href="#" style="display: inline-block; margin-bottom: 16px; margin-right: 4px;" @click.prevent="$emit('showLikesModal')">{{ totalLikes }} likes</a>
        <a v-if="post.total_comments > 0" href="#" style="display: inline-block; margin-bottom: 16px; margin-right: 4px;">{{ post.total_comments }} comments</a>
        <a v-if="post.total_direct_children_posts > 0" href="#" style="display: inline-block; margin-bottom: 16px; margin-left: 4px;" @click.prevent="$emit('showRedrawsModal')">{{ post.total_direct_children_posts }} redraws</a>
        <div>
          <b-button variant="link" @click="toggleLike()" v-b-tooltip.hover title="Like" style="display: inline-block; margin-right: 12px; padding: 0; color: #FF7851;">
            <heart-icon size="2x" :class="{ 'filled': userLiked }"/>
          </b-button>
          <b-button variant="link" v-b-tooltip.hover title="Comment" style="display: inline-block; margin-right: 12px; padding: 0;">
            <message-circle-icon size="2x"/>
          </b-button>
          <b-button variant="link" @click="$bus.$emit('createPost', post.id)" v-b-tooltip.hover title="Redraw" style="display: inline-block; margin-right: 12px; padding: 0;">
            <edit-3-icon size="2x"/>
          </b-button>
        </div>
      </div>
      <div class="card-footer">
        Comments...
      </div>
    </div>
    <div v-if="showingLikeOverlay" class="like-overlay">
      <div class="like-overlay-inner">
        <heart-icon size="5x" class="filled"/>
      </div>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'
import VImage from '@/components/Image.vue'
import { MoreHorizontalIcon, HeartIcon, MessageCircleIcon, Edit3Icon } from 'vue-feather-icons'

export default {
  components: {
    Avatar,
    VImage,
    MoreHorizontalIcon,
    HeartIcon,
    MessageCircleIcon,
    Edit3Icon
  },

  props: {
    post: { type: Object, required: true }
  },

  data: function () {
    return {
      userLiked: false,
      totalLikes: 1,
      showingLikeOverlay: false
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),

    dropdownItems () {
      var items = []

      if(this.$route.name !== 'posts.show' || parseInt(this.$route.params.id) !== this.post.id) {
        items.push({
          to: { name: 'posts.show', params: { id: this.post.id } },
          onclick: () => {},
          text: 'Go to post'
        })
      }

      if(this.isAuthenticated && this.loggedInUser.id === this.post.author_id) {
        items.push({
          to: null,
          onclick: () => {
            this.$bus.$emit('editPost', this.post.id)
          },
          text: 'Edit post'
        })
        items.push({
          to: null,
          onclick: this.confirmDelete,
          text: 'Delete post',
          variant: 'danger'
        })
      }

      if(this.isAuthenticated && this.loggedInUser.id !== this.post.author_id) {
        items.push({
          to: {},
          onclick: () => {},
          text: 'Report post',
          variant: 'danger'
        })
        items.push({
          to: {},
          onclick: () => {},
          text: 'Report user',
          variant: 'danger'
        })
      }

      return items
    }
  },

  created () {
    this.userLiked = this.post.user_liked
    this.totalLikes = this.post.total_likes
  },

  methods: {
    async toggleLike () {
      if (!this.userLiked) {
        await this.$axios.post(`/posts/${this.post.id}/like`)

        this.userLiked = true
        this.totalLikes++
        this.showLikeOverlay()
      } else {
        await this.$axios.post(`/posts/${this.post.id}/unlike`)

        this.userLiked = false
        this.totalLikes--
      }
    },

    showLikeOverlay () {
      this.showingLikeOverlay = true
      const self = this
      setTimeout(() => { self.showingLikeOverlay = false }, 1000)
    },

    async confirmDelete () {
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
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>
