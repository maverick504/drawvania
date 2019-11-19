<template>
  <div v-show="form.hasErrorMessage()" class="bg-danger-100 border-l-4 border-danger-500 text-danger-700 p-4 mb-4" role="alert">
    <p>{{ form.getErrorMessage() }}</p>
  </div>
</template>

<script>
export default {
  props: {
    form: { type: Object, required: true }
  }
}
</script>
