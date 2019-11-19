<template>
  <form method="post" @submit.prevent="update">

    <error-alert :form="form"/>

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
