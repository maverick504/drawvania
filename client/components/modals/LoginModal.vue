<template>
  <t-modal 
    ref="modal" 
    v-model="show" 
    header="Log in" 
    header-class="bg-gray-100 p-4 text-xl text-center" 
    width="400" 
    @before-close="beforeClose">
    <form 
      method="post" 
      @submit.prevent="login">

      <error-alert :form="form"/>

      <div class="form-group">
        <label 
          class="block text-gray-700 mb-2" 
          for="login-modal-email">Email</label>
        <t-input
          id="login-modal-email"
          :class="{ 'border-danger': form.hasErrors('email') }"
          v-model="form.email"
          placeholder="Email"
        />
        <has-error 
          :form="form" 
          field="email"/>
      </div>

      <div class="form-group">
        <label 
          class="block text-gray-700 mb-2" 
          for="login-modal-password">Password</label>
        <t-input
          id="login-modal-password"
          :class="{ 'border-danger': form.hasErrors('password') }"
          v-model="form.password"
          type="password"
          placeholder="Password"
        />
        <has-error 
          :form="form" 
          field="password"/>
      </div>

      <div class="form-group">
        <t-button 
          :class="{ 'btn-loading': form.busy }" 
          class="block w-full" 
          type="submit" 
          variant="primary">
          Login
        </t-button>
      </div>

      <div class="text-center">
        Don't have an account? <nuxt-link 
          :to="{ name: 'auth.register' }" 
          class="text-primary">Register</nuxt-link>
      </div>

    </form>
  </t-modal>
</template>

<script>
import Form from '@/plugins/adonis-form'

export default {
  data () {
    return {
      show: false,
      form: new Form({
        email: null,
        password: null
      })
    }
  },

  mounted () {
    this.$bus.$on('showLoginModal', () => {
      this.form.clearErrors()
      this.show = true
    })
  },

  beforeDestroy () {
    this.$bus.$off('showLoginModal')
  },

  methods: {
    async login() {
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
    },

    beforeClose () {
      if(!this.form.busy) return

      const scrollTopBefore = this.$refs.modal.$el.scrollTop

      this.$nextTick(() => {
        this.show = true

        this.$nextTick(() => {
          this.$refs.modal.$el.scrollTo(0, scrollTopBefore)
        })
      })
    }
  }
}
</script>
