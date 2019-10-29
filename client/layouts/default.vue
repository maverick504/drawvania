<template>
  <div>
    <b-navbar variant="faded" type="light" class="text-center">
      <b-navbar-brand class="mx-auto" to="/">
        Drawvania
      </b-navbar-brand>
    </b-navbar>
    <div class="app-main-container">
      <aside class="d-none d-md-block app-left-sidebar">
        <no-ssr>
          <affix class="app-left-sidebar-inner" relative-element-selector="#content" :offset="{ top: 0, bottom: 0 }">
            <div v-if="isAuthenticated" class="logged-user-block mb-3">
              <div class="logged-user-block-avatar">
                <nuxt-link to="/">
                  <avatar :user="loggedInUser" size="lg" class="d-block"/>
                </nuxt-link>
              </div>
              <div class="logged-user-block-username">
                <nuxt-link to="/" :title="`@${loggedInUser.username}`">@{{ loggedInUser.username }}</nuxt-link>
              </div>
              <div class="logged-user-block-notifications">
                <router-link to="/" class="text-muted">
                  <bell-icon size="2x"/>
                </router-link>
                <small class="badge badge-pill badge-primary">99</small>
              </div>
            </div>
            <template v-if="isAuthenticated">
              <nuxt-link :to="{ name: 'settings.profile' }" class="app-left-sidebar-item text-muted">
                <settings-icon size="1.5x"/>
                Settings
              </nuxt-link>
              <router-link :to="{ name: 'upload' }" class="btn btn-primary btn-lg btn-block submit-button">
                <plus-icon size="1.5x"/>
                <span style="vertical-align: middle;">Submit</span>
              </router-link>
              <div class="app-left-secondary-item">
                <a href="#" @click.prevent="logout">Logout</a>
              </div>
            </template>
            <template v-else>
              <router-link :to="{ name: 'auth.register' }" class="btn btn-primary btn-lg btn-block" style="margin-top: 8px; border-radius: 24px; color: #fff;">
                <log-in-icon size="1.5x"/>
                <span style="vertical-align: middle;">Register</span>
              </router-link>
              <div class="app-left-secondary-item">
                <router-link :to="{ name: 'auth.login' }">Login</router-link>
              </div>
            </template>
            <hr>
            <div style="margin: 16px 0; text-align: center;">
              <!--
              <a href="http://localhost:3333/support" target="_blank" style="color: #888; margin-right: 8px;">Donate/Premium</a>
              <a href="http://localhost:3333/supporters" target="_blank" style="color: #888; margin-right: 8px;">Supporters</a>
              <a href="http://localhost:3333/help" target="_blank" style="color: #888; margin-right: 8px;">Help</a>
              -->
            </div>
          </affix>
        </no-ssr>
      </aside>
      <main class="app-content" id="content">
        <router-view :key="$route.fullPath"/>
      </main>
      <aside class="d-none d-lg-block app-right-sidebar">
        <no-ssr>
          <affix class="app-right-sidebar-inner" relative-element-selector="#content" :offset="{ top: 0, bottom: 0 }" :scroll-affix="true">
          </affix>
        </no-ssr>
      </aside>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'
import { LogInIcon, LogOutIcon, BellIcon, PlusIcon, SettingsIcon } from 'vue-feather-icons'

export default {
  components: {
    Avatar,
    LogInIcon,
    LogOutIcon,
    BellIcon,
    PlusIcon,
    SettingsIcon
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },

  methods: {
    logout () {
      this.$auth.logout()
    }
  }
}
</script>
