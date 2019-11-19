<template>
  <nav class="w-full bg-white fixed pin-t z-10 shadow-md whitespace-no-wrap">
    <div class="flex container mx-auto">
      <div class="flex-initial py-3 text-center">
        <router-link :to="{ name: 'feed.global' }" class="text-xl mr-2">
          Drawvania
        </router-link>
      </div>
      <div class="flex-grow block text-right">
        <router-link :to="{ name: 'feed.global' }" class="inline-block px-6 py-4">
          <compass-icon size="1.5x" class="inline mr-1"/>
          <span class="align-middle">Explore</span>
        </router-link><!--
     --><template v-if="isAuthenticated">
          <router-link :to="{ name: 'notifications' }" class="inline-block px-6 py-4">
            <bell-icon size="1.5x" class="inline"/>
          </router-link><!--
       --><t-dropdown
            class="inline-block text-left"
            :button-props="{
              baseClass: 'inline-block px-6 py-4',
              to: { name: 'users.show', params: { username: loggedInUser.username } }
            }"
            :visible-arrow="false"
            dropdown-class="w-64 bg-white border shadow-md py-4 z-10"
            placement="bottom-end"
            trigger="hover"
          >
            <template slot="button-content">
              <user-icon size="1.5x" class="inline"/>
            </template>
            <ul>
              <li><router-link :to="{ name: 'users.show', params: { username: loggedInUser.username } }" class="block text-xl font-bold no-underline px-6 py-2 hover:text-primary" active-class="text-primary">
                {{ loggedInUser.username }}
              </router-link></li>
              <li class="h-4"></li>
              <li><router-link :to="{ name: 'users.show', params: { username: loggedInUser.username } }" class="block no-underline px-6 py-2 hover:text-primary" active-class="text-primary">
                Profile
              </router-link></li>
              <li><router-link :to="{ name: 'settings.profile' }" class="block no-underline px-6 py-2 hover:text-primary" active-class="text-primary">
                Settings
              </router-link></li>
              <li class="h-4"></li>
              <li><a href="#" class="block no-underline px-6 py-2 hover:text-primary" @click.prevent="logout">
                Log out
              </a></li>
            </ul>
          </t-dropdown><!--
       --><a href="#" class="inline-block px-6 py-4 text-primary" @click.prevent="$bus.$emit('createPost')">
            <plus-icon size="1.5x" class="inline mr-1"/>
            <span class="align-middle">Submit</span>
          </a>
        </template><!--
     --><template v-if="!isAuthenticated">
          <a href="#" class="inline-block px-6 py-4" @click="$bus.$emit('showLoginModal')">
            <log-in-icon size="1.5x" class="inline mr-1"/><span class="align-middle">Log in</span>
          </a><!--
       --><router-link :to="{ name: 'auth.register' }" class="inline-block px-6 py-4 text-primary">
            <user-plus-icon size="1.5x" class="inline mr-1"/><span class="align-middle">Register</span>
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import { PlusIcon, CompassIcon, BellIcon, UserIcon, LogInIcon, UserPlusIcon } from 'vue-feather-icons'

export default {
  components: {
    PlusIcon,
    CompassIcon,
    BellIcon,
    UserIcon,
    LogInIcon,
    UserPlusIcon
  },

  computed: {
    ...mapGetters([ 'isAuthenticated', 'loggedInUser' ])
  },

  methods: {
    logout () {
      this.$auth.logout()
    }
  }
}
</script>

<style lang="css" scoped>
</style>
