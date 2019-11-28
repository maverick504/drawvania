<template>
  <nav class="w-full bg-white fixed pin-t z-20 shadow-md whitespace-no-wrap">
    <div class="flex container mx-auto">
      <div class="flex-initial py-3 text-center">
        <router-link :to="{ name: 'feed.global' }" class="text-xl mr-2">
          Drawvania
        </router-link>
      </div>
      <div class="flex-grow flex justify-end">
        <template v-if="isAuthenticated">
          <notifications-dropdown/><!--
       --><t-dropdown
            :button-props="{
              baseClass: 'inline-block',
              defaultSizeClass: 'p-4'
            }"
            :visible-arrow="false"
            dropdown-class="w-64 bg-white border shadow-md py-4 z-10"
            placement="bottom"
            trigger="click"
            class="inline-block"
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
       --><t-button baseClass="inline-block text-primary" defaultSizeClass="p-4" @click.prevent="$bus.$emit('createPost')">
            <plus-icon size="1.5x" class="inline mr-1"/>
            <span class="align-middle">Submit</span>
          </t-button>
        </template><!--
     --><template v-if="!isAuthenticated">
          <t-button baseClass="inline-block" defaultSizeClass="p-4" @click="$bus.$emit('showLoginModal')">
            <log-in-icon size="1.5x" class="inline mr-1"/><span class="align-middle">Log in</span>
          </t-button><!--
       --><router-link :to="{ name: 'auth.register' }" class="inline-block p-4 text-primary">
            <user-plus-icon size="1.5x" class="inline mr-1"/><span class="align-middle">Register</span>
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import NotificationsDropdown from '@/components/navbar/NotificationsDropdown.vue'
import { PlusIcon, UserIcon, LogInIcon, UserPlusIcon } from 'vue-feather-icons'

export default {
  components: {
    NotificationsDropdown,
    PlusIcon,
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
