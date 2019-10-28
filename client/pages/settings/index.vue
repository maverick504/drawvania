<template>
  <div>
    <h1 class="title">Settings</h1>
    <ul class="nav nav-tabs nav-justified">
      <li class="nav-item">
        <router-link :to="{ name: 'settings.profile' }" active-class="active" class="nav-link">
          Profile
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{ name: 'settings.password' }" active-class="active" class="nav-link">
          Password
        </router-link>
      </li>
    </ul>
    <div class="py-3">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth'
};
</script>
