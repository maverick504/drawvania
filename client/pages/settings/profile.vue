<template>
  <div>
    <div class="text-center mb-3">
      <avatar v-if="loggedInUser" :user="loggedInUser" size="40" class="mx-auto cursor-pointer" @click.native="$refs.avatarFile.click()"/>
      <input ref="avatarFile" class="hidden" type="file" @change="avatarFileChanged()">
    </div>

    <form method="post" @submit.prevent="update">

      <error-alert :form="form"/>

      <form-group label="Username">
        <t-input
          v-model="form.username"
          :class="{ 'border-danger': form.hasErrors('username') }"
          placeholder="Username"
        />
        <has-error :form="form" field="username"/>
      </form-group>

      <form-group label="Gender">
        <t-select
          v-model="form.gender"
          :options="[
            { value: '', text: '' },
            { value: 'male', text: 'Male' },
            { value: 'female', text: 'Female' }
          ]"
        />
        <has-error :form="form" field="gender"/>
      </form-group>

      <form-group label="Location">
        <t-input
          v-model="form.location"
          :class="{ 'border-danger': form.hasErrors('location') }"
          placeholder="Location"
        />
        <has-error :form="form" field="location"/>
      </form-group>

      <form-group label="About">
        <t-textarea
          v-model="form.about"
          :class="{ 'border-danger': form.hasErrors('about') }"
          placeholder="About"
        />
        <has-error :form="form" field="about"/>
      </form-group>

      <div class="form-group">
        <t-button :class="{ 'btn-loading': form.busy }" type="submit" variant="primary">
          Update
        </t-button>
      </div>

    </form>
  </div>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'

export default {
  head () {
    return { title: 'Settings - Profile' }
  },

  components: {
    Avatar
  },

  data: function () {
    return {
      form: new Form({
        username: '',
        gender: null,
        location: null,
        about: null
      })
    }
  },

  computed: {
    ...mapGetters(['loggedInUser'])
  },

  mounted () {
    this.$nextTick(() => {
      // Fill the form with user data.
      this.form.username = this.loggedInUser.username
      this.form.gender = this.loggedInUser.gender
      this.form.location = this.loggedInUser.location
      this.form.about = this.loggedInUser.about
    })
  },

  methods: {
    async avatarFileChanged () {
      try {
        const file = this.$refs.avatarFile.files[0]

        let formData = new FormData()
        formData.append('image', file)

        const response = await this.$axios.patch('settings/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        this.$store.dispatch('updateUser', { user: response.data.data })

        swal.fire({
          type: 'success',
          title: 'Avatar updated!',
          showConfirmButton: false,
          timer: 1500
        })
      } catch (e) {
        swal.fire({
          type: 'error',
          title: 'Something went wrong, please try again!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    },

    async update () {
      this.form.clearErrors()
      this.form.busy = true

      try {
        const response = await this.$axios.patch('settings/profile', {
          username: this.form.username,
          gender: this.form.gender,
          location: this.form.location,
          about: this.form.about
        })
        const user = response.data.data

        this.$store.dispatch('updateUser', { user: user })

        swal.fire({
          type: 'success',
          title: 'Profile updated!',
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
