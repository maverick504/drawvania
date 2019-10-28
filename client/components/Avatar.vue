<template>
  <figure :class="{ [`avatar-${size}`]: true }" :data-initial="user.avatar===null?user.username.substr(0, 2):''" class="avatar">
    <img v-if="user.avatar!==null" :src="user.avatar[1].url" :alt="user.username">
  </figure>
</template>

<script>
export default {
  props: {
    user: { type: Object, required: true },
    size: { type: String, default: 'md' }
  }
}
</script>
