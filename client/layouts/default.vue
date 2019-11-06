<template>
  <div class="bg-light">
    <b-navbar toggleable="md" variant="white" type="light" fixed="top">
      <div class="container">
        <b-navbar-brand :to="{ name: 'home' }">
          Drawvania <small class="text-primary">Beta</small>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="isAuthenticated" @click="createPost()">
              <span class="text-primary">
                <plus-icon/> Submit
              </span>
            </b-nav-item>
            <b-nav-item :to="{ name: 'home' }">
              <compass-icon/> Explore
            </b-nav-item>
            <b-nav-item v-if="isAuthenticated" href="#">
              <bell-icon/>
              <small class="badge badge-pill badge-primary">99</small>
            </b-nav-item>
            <b-nav-item-dropdown v-if="isAuthenticated" right>
              <template slot="button-content">
                <user-icon/> {{ loggedInUser.username }}
              </template>
              <b-dropdown-item to="/">Profile</b-dropdown-item>
              <b-dropdown-divider/>
              <b-dropdown-item :to="{ name: 'settings.profile' }">Profile settings</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'settings.password' }">Change password</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'settings.notifications' }">Notification settings</b-dropdown-item>
              <b-dropdown-divider/>
              <b-dropdown-item @click.prevent="logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item v-if="!isAuthenticated" @click="showLoginModal">
              <log-in-icon/> Login
            </b-nav-item>
            <b-nav-item v-if="!isAuthenticated" :to="{ name: 'auth.register' }">
              <span class="text-primary">
                <user-plus-icon/> Register
              </span>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
    <div style="height: 58px;"></div>
    <div class="app-main-container">
      <aside class="d-none d-md-block app-left-sidebar">
        <no-ssr>
          <affix class="app-left-sidebar-inner" relative-element-selector="#content" :offset="{ top: 58, bottom: 0 }">
            <h2 class="h5 text-center mb-3">🏆 Weekly ranking 🏆</h2>
            <div class="list-group">
              <router-link
                v-for="(post, index) in weeklyRanking"
                :key="index"
                :to="{ name: 'posts.show', params: { id: post.id } }"
                class="list-group-item list-group-item-action"
                style="display: flex; flex-direction: row; align-items: center; padding: 0;"
              >
                <img style="flex-grow: 0; width: 80px; height: 80px; margin-right: 12px;" :src="post.media[0].variations['100x100'].url">
                <div style="flex-grow: 1; margin-right: 12px;">
                  <div style="white-space: nowrap; width: 142px; overflow: hidden; text-overflow: ellipsis;">by @{{ post.author.username }}</div>
                  <div style="display: flex; align-items: center;"><heart-icon style="margin-right: 4px;"/> {{ post.total_likes }}</div>
                </div>
              </router-link>
            </div>
            <div style="margin: 16px 0; text-align: center;">
              <a v-if="isAuthenticated" href="#" target="_blank" style="white-space: nowrap; color: #888; margin-right: 8px;">Donate/Become Premium</a>
              <a v-if="isAuthenticated" href="#" target="_blank" style="white-space: nowrap; color: #888; margin-right: 8px;">List of supporters</a>
              <a v-if="isAuthenticated" href="#" target="_blank" style="white-space: nowrap; color: #888; margin-right: 8px;">Discord Chat</a>
              <a href="#" target="_blank" style="white-space: nowrap; color: #888; margin-right: 8px;">Help Center</a>
            </div>
          </affix>
        </no-ssr>
      </aside>
      <main class="app-content" id="content">
        <nuxt/>
      </main>
      <aside class="d-none d-lg-block app-right-sidebar">
        <no-ssr>
          <affix class="app-right-sidebar-inner" relative-element-selector="#content" :offset="{ top: 58, bottom: 0 }" :scroll-affix="true">
            <h2 class="h5 text-center mb-3">📣 Announcements 📣</h2>
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Hola mundo</h5>
                <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
            </div>
          </affix>
        </no-ssr>
      </aside>
    </div>
    <canvas ref="confettiCanvas" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events:none;"></canvas>
    <create-post-modal ref="createPostModal"/>
    <edit-post-modal ref="editPostModal"/>
    <login-modal v-if="!isAuthenticated" ref="loginModal"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'
import CreatePostModal from '@/components/CreatePostModal.vue'
import EditPostModal from '@/components/EditPostModal.vue'
import LoginModal from '@/components/LoginModal.vue'
import { PlusIcon, CompassIcon, UserIcon, BellIcon, LogInIcon, UserPlusIcon, HeartIcon } from 'vue-feather-icons'

export default {
  components: {
    Avatar,
    CreatePostModal,
    EditPostModal,
    LoginModal,
    PlusIcon,
    CompassIcon,
    UserIcon,
    BellIcon,
    LogInIcon,
    UserPlusIcon,
    HeartIcon
  },

  data: function () {
    return {
      weeklyRanking: [],
      confetti: null
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },

  mounted () {
    const canvasConfetti = require('canvas-confetti')
    this.confetti = canvasConfetti.create(this.$refs.confettiCanvas, { resize: true })

    this.$bus.$on('fireConfetti', this.fireConfetti)
    this.$bus.$on('createPost', this.createPost)
    this.$bus.$on('editPost', this.editPost)
    this.$bus.$on('showLoginModal', this.showLoginModal)

    this.loadweeklyRanking()
  },

  methods: {
    async loadweeklyRanking () {
      const response = await this.$axios.get(`/miscellaneous/weekly-ranking`)
      this.weeklyRanking = response.data
    },

    fireConfetti () {
      this.confetti({
        particleCount: 150,
        spread: 160
      })
    },

    createPost (parentPostId = null) {
      this.$refs.createPostModal.open(parentPostId)
    },

    editPost (postId) {
      this.$refs.editPostModal.open(postId)
    },

    showLoginModal () {
      this.$refs.loginModal.open()
    },

    logout () {
      this.$auth.logout()
    }
  }
}
</script>
