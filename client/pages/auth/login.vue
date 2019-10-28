<template>
  <b-card class="auth-card">
    <h1 class="h1 text-center">Drawvania</h1>
    <p class="text-center mb-3">Log-in</p>
    <b-form method="post" @submit.prevent="login">

      <error-alert :form="form"/>

      <b-form-group horizontal label="Email">
        <b-form-input v-model="form.email" type="email" required></b-form-input>
        <has-error :form="form" field="email"/>
      </b-form-group>

      <b-form-group horizontal label="Password">
        <b-form-input v-model="form.password" type="password" required></b-form-input>
        <has-error :form="form" field="password"/>
      </b-form-group>

      <b-form-group horizontal>
        <b-button :class="{ 'btn-loading': form.busy }" type="submit" variant="primary" block @click.prevent="login">
          Login
        </b-button>
      </b-form-group>

      <div class="text-center">
        Don't have an account?
        <nuxt-link :to="{ name: 'auth.register' }">Register</nuxt-link>
      </div>

    </b-form>
  </b-card>
</template>

<script>
import Form from '@/plugins/adonis-form'

export default {
  middleware: 'guest',

  layout: 'auth',

  data () {
    return {
      form: new Form({
        email: null,
        password: null
      })
    }
  },

  methods: {
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

        this.$router.push('/')
      } catch (e) {
        this.form.handleErrorResponse(e.response)
      }

      this.form.busy = false
    }
  }
}
</script>
