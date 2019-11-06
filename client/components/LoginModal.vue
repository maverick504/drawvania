<template>
  <b-modal id="login-modal" size="sm" centered title="Login" title-class="w-100 text-center" hide-footer>

    <b-form method="post" @submit.prevent="login">

      <error-alert :form="form"/>

      <b-form-group horizontal label="Email">
        <b-form-input
          :class="{ 'is-invalid': form.hasErrors('email') }"
          v-model="form.email"
          type="email"
          placeholder="Email"
        />
        <has-error :form="form" field="email"/>
      </b-form-group>

      <b-form-group horizontal label="Password">
        <b-form-input
          :class="{ 'is-invalid': form.hasErrors('password') }"
          v-model="form.password"
          type="password"
          placeholder="Password"
        />
        <has-error :form="form" field="password"/>
      </b-form-group>

      <b-form-group horizontal>
        <b-button :class="{ 'btn-loading': form.busy }" type="submit" variant="primary" block>
          Login
        </b-button>
      </b-form-group>

      <div class="text-center">
        Don't have an account?
        <nuxt-link :to="{ name: 'auth.register' }">Register</nuxt-link>
      </div>

    </b-form>

  </b-modal>
</template>

<script>
import Form from '@/plugins/adonis-form'

export default {
  data () {
    return {
      form: new Form({
        email: null,
        password: null
      })
    }
  },

  methods: {
    open () {
      this.$bvModal.show('login-modal')
    },

    async login() {
      this.form.clearErrors()
      this.form.busy = true

      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.form.email,
            password: this.form.password
          }
        })
      } catch (e) {
        this.form.handleErrorResponse(e.response)
      }

      this.form.busy = false
    }
  }
}
</script>
