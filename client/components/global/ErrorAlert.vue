<template>
  <div v-show="form.hasErrorMessage()" role="alert" class="alert alert-danger">
    {{ form.getErrorMessage() }}
  </div>
</template>

<script>
export default {
  props: {
    form: { type: Object, required: true }
  }
}
</script>
