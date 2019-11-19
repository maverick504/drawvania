<template>
  <form method="post" @submit.prevent="update">

    <error-alert :form="form"/>

    <form-group label="Current password">
      <t-input
        v-model="form.current_password"
        :class="{ 'border-danger': form.hasErrors('current_password') }"
        type="password"
        placeholder="Current password"
      />
      <has-error :form="form" field="current_password"/>
    </form-group>

    <form-group label="New password">
      <t-input
        v-model="form.new_password"
        :class="{ 'border-danger': form.hasErrors('new_password') }"
        type="password"
        placeholder="New password"
      />
      <has-error :form="form" field="new_password"/>
    </form-group>

    <form-group label="New password confirmation">
      <t-input
        :class="{ 'border-danger': form.hasErrors('new_password_confirmation') }"
        v-model="form.new_password_confirmation"
        type="password"
        id="new_password_confirmation"
        placeholder="New password confirmation"
      />
      <has-error :form="form" field="new_password_confirmation"/>
    </form-group>

    <div class="form-group">
      <t-button :class="{ 'btn-loading': form.busy }" type="submit" variant="primary">
        Update
      </t-button>
    </div>

  </form>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'

export default {
  head () {
    return { title: 'Settings - Password' }
  },

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
