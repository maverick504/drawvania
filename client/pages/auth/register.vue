<template>
  <b-card class="auth-card">
    <h1 class="h1 text-center">Drawvania</h1>
    <p class="text-center mb-3">Create an account</p>
    <b-form method="post" @submit.prevent="register">

      <error-alert :form="form"/>

      <b-form-group horizontal label="Username">
        <b-form-input
          :class="{ 'is-invalid': form.hasErrors('username') }"
          v-model="form.username"
          type="text"
          placeholder="Username"
        />
        <has-error :form="form" field="email"/>
      </b-form-group>

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
          Register
        </b-button>
      </b-form-group>

      <div class="text-center">
        Already got an account?
        <nuxt-link :to="{ name: 'auth.login' }">Login</nuxt-link>
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
        username: '',
        email: '',
        password: '',
      })
    }
  },

  methods: {
    async register() {
      this.form.clearErrors()
      this.form.busy = true

      try {
        await this.$axios.post('register', {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password
        })

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
