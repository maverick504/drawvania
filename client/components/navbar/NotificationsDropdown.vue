<template>
  <t-dropdown
    :button-props="{
      baseClass: 'inline-block',
      defaultSizeClass: 'p-4'
    }"
    :visible-arrow="false"
    dropdown-class="w-96 bg-white border shadow-md z-10"
    placement="bottom"
    trigger="click"
    class="inline-block"
    @click="onClick"
    @blur="onBlur"
  >
    <template slot="button-content">
      <div class="relative">
        <bell-icon size="1.5x" class="inline" />
        <span v-if="newNotifications > 0" class="bg-primary px-1 text-xs text-white rounded-full" style="position: absolute; right: -8px; top: -4px;">
          {{ newNotifications }}
        </span>
      </div>
    </template>
    <div id="notifications-dropdown-content" class="overflow-auto" style="max-height: 400px;">
      <template v-if="notifications.length > 0">
        <notification-item
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
        />
      </template>
      <div v-if="notifications.length === 0 && !loading" class="py-8 text-center text-gray-600">
        You don't have any notifications yet...
      </div>
      <div v-if="loading" :class="{ 'py-8': notifications.length === 0 }" class="text-primary text-center">
        <div class="spinner" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </t-dropdown>
</template>

<script>
import NotificationItem from '@/components/NotificationItem.vue'
import { BellIcon } from 'vue-feather-icons'

export default {
  components: {
    NotificationItem,
    BellIcon
  },

  data: function () {
    return {
      notifications: [],
      newNotifications: 0,
      loading: false,
      page: null,
      lastPage: null,
      total: null
    }
  },

  created () {
  	setInterval(this.checkNewNotifications, 15000)
  },

  beforeDestroy () {
    clearInterval(this.checkNewNotifications, 15000)
  },

  methods: {
    async onClick () {
      this.clearNotifications()
      await this.loadMoreNotifications()

      // Handle scroll on the DropDown content (Implement infinite scroll).
      document.getElementById('notifications-dropdown-content').addEventListener('scroll', this.onScroll)
    },

    onBlur () {
      document.getElementById('notifications-dropdown-content').removeEventListener('scroll', this.onScroll)

      this.newNotifications = 0
    },

    onScroll (event) {
      const dropDownContent = document.getElementById('notifications-dropdown-content')
      const bottomOfContent = dropDownContent.scrollTop + dropDownContent.clientHeight === dropDownContent.scrollHeight
      if (bottomOfContent && !this.loading && (this.page !== this.lastPage)) {
        this.loadMoreNotifications()
      }
    },

    async checkNewNotifications () {
      const { data } = await this.$axios.get(`pull`)
      this.newNotifications = data.new_notifications
    },

    clearNotifications () {
      this.notifications = []
      this.page = null
      this.lastPage = null
      this.total = null
    },

    async loadMoreNotifications () {
      if(this.loading) {
        return
      }

      this.page = this.page === null ? 1 : this.page + 1

      this.loading = true

      const response = await this.$axios.get(`notifications?page=${this.page}`)

      this.notifications = this.notifications.concat(response.data.data)
      this.lastPage = response.data.lastPage
      this.total = response.data.total

      this.loading = false
    }
  }
}
</script>
