<template>
  <div>
    <div class="form-switch inline-block align-middle">
      <input
        :id="id"
        :value="value"
        v-model="isToggleOn"
        type="checkbox"
        class="form-switch-checkbox"
        @change="$emit('input', $event.target.checked)"
      >
      <label
        class="form-switch-label"
        :for="id"
      />
    </div>
    <label class="align-middle text-gray-900" :for="id">
      {{ `${ isToggleOn ? onText : offText }` }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, required: true },
    value: { type: Boolean, default: false, required: false },
    onText: { type: String, required: true },
    offText: { type: String, required: true }
  },

  data () {
    return {
      isToggleOn: false
    }
  },

  mounted () {
    this.isToggleOn = this.value
  }
}
</script>
