<template>
  <span v-if="form.hasErrors(field)" class="text-danger text-sm">
    {{ form.getFirstError(field) }}
  </span>
</template>

<script>
export default {
  props: {
    form: { type: Object, required: true },
    field: { type: String, required: true }
  }
}
</script>
