<template>
  <div class="py-16">
    <div class="container mx-auto bg-white border rounded overflow-hidden">
      <div class="flex">
        <div class="w-1/4 border-r">
          <router-link :to="{ name: 'settings.profile' }" active-class="border-l-4 border-primary" class="block p-4 hover:bg-gray-100 hover:text-primary">
            Edit Profile
          </router-link>
          <router-link :to="{ name: 'settings.password' }" active-class="border-l-4 border-primary" class="block p-4 hover:bg-gray-100 hover:text-primary">
            Change Password
          </router-link>
          <router-link :to="{ name: 'settings.notifications' }" active-class="border-l-4 border-primary" class="block p-4 hover:bg-gray-100 hover:text-primary">
            Notifications Settings
          </router-link>
        </div>
        <div class="w-3/4 px-4 py-8">
          <nuxt-child/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth'
};
</script>
