<template>
  <b-form @submit.prevent="update">

    <error-alert :form="form"/>

    <b-form-group horizontal>
      <b-button :class="{ 'btn-loading': form.busy }" type="submit" variant="primary">
        Update
      </b-button>
    </b-form-group>

  </b-form>
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
        user_liked_post: null,
        user_commented_post: null
      })
    }
  },

  methods: {
    async update () {
      // ..
    }
  }
}
</script>
