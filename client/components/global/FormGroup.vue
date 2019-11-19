<template>
  <div class="form-group">
    <label v-if="label !== ''">{{ label }}</label>
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: '', required: false }
  }
}
</script>
