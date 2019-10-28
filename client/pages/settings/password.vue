<template>
  <b-form @submit.prevent="update" @keydown="form.onKeydown($event)">

    <error-alert :form="form"/>

    <b-form-group horizontal label="Current password">
      <b-form-input
        :class="{ 'is-invalid': form.hasErrors('current_password') }"
        v-model="form.current_password"
        type="password"
        placeholder="Current password"
      />
      <has-error :form="form" field="current_password"/>
    </b-form-group>

    <b-form-group horizontal label="New password">
      <b-form-input
        :class="{ 'is-invalid': form.hasErrors('new_password') }"
        v-model="form.new_password"
        type="password"
        placeholder="New password"
      />
      <has-error :form="form" field="new_password"/>
    </b-form-group>

    <b-form-group horizontal label="New password confirmation">
      <b-form-input
        :class="{ 'is-invalid': form.hasErrors('new_password_confirmation') }"
        v-model="form.new_password_confirmation"
        type="password"
        placeholder="New password confirmation"
      />
      <has-error :form="form" field="new_password_confirmation"/>
    </b-form-group>

    <b-form-group horizontal>
      <b-button :class="{ 'btn-loading': form.busy }" type="submit" variant="primary" @click.prevent="update">
        Update
      </b-button>
    </b-form-group>

  </b-form>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'

export default {
  data: function () {
    return {
      form: new Form({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      })
    }
  },

  methods: {
    async update () {
      this.form.clearErrors()
      this.form.busy = true

      try {
        await this.$axios.patch('settings/password', {
          current_password: this.form.current_password,
          new_password: this.form.new_password,
          new_password_confirmation: this.form.new_password_confirmation
        })

        swal.fire({
          type: 'success',
          title: 'Password updated!',
          showConfirmButton: false,
          timer: 1500
        })
      } catch (e) {
        this.form.handleErrorResponse(e.response)
      }

      this.form.busy = false
    }
  }
}
</script>
