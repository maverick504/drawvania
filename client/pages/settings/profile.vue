<template>
  <div>
    <div class="text-center mb-3">
      <avatar v-if="loggedInUser" :user="loggedInUser" size="xl" style="cursor: pointer;" @click.native="$refs.avatarFile.click()"/>
      <input ref="avatarFile" class="d-none" type="file" @change="avatarFileChanged()">
    </div>
    <b-form @submit.prevent="update" @keydown="form.onKeydown($event)">

      <error-alert :form="form"/>

      <b-form-group horizontal label="Username">
        <b-form-input
          :class="{ 'is-invalid': form.hasErrors('username') }"
          v-model="form.username"
          type="text"
          placeholder="Username"
        />
        <has-error :form="form" field="username"/>
      </b-form-group>

      <b-form-group horizontal label="Sex">
        <b-form-select
          v-model="form.gender"
          :options="[ { value: null, text: 'Sex' }, { value: 'M', text: 'Male' }, { value: 'F', text: 'Female' } ]"
        />
        <has-error :form="form" field="gender"/>
      </b-form-group>

      <b-form-group horizontal label="Location">
        <b-form-input
          :class="{ 'is-invalid': form.hasErrors('location') }"
          v-model="form.location"
          type="text"
          placeholder="Location"
        />
        <has-error :form="form" field="location"/>
      </b-form-group>

      <b-form-group horizontal label="About">
        <b-form-textarea
          :class="{ 'is-invalid': form.hasErrors('about') }"
          v-model="form.about"
          placeholder="Enter something about you..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        <has-error :form="form" field="about"/>
      </b-form-group>

      <b-form-group horizontal>
        <b-button :class="{ 'btn-loading': form.busy }" type="submit" variant="primary" @click.prevent="update">
          Update
        </b-button>
      </b-form-group>

    </b-form>
  </div>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'

export default {
  head () {
    return { title: 'Settings' }
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
      this.form.keys().forEach((key) => {
        this.form[key] = this.loggedInUser[key]
      })
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

        this.$store.dispatch('updateUser', { user: response.data.data })

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
