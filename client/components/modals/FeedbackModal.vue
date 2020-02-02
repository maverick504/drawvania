<template>
  <t-modal
    ref="modal"
    v-model="show"
    header="Send feedback"
    header-class="bg-gray-100 p-4 text-xl"
    footer-class="bg-gray-100 p-4 text-right"
    width="400"
    @before-close="beforeClose"
  >

    <form method="post" @submit.prevent="send">

      <error-alert :form="form"/>

      <div class="bg-gray-100 border-l-4 border-gray-500 text-gray-700 p-4 mb-4">
        <p>We do not reply to feedback submited through this form. If you have any problem, send us a DM on <a href="https://twitter.com/drawvania" target="_blank" class="text-primary">Twitter</a>.</p>
      </div>

      <t-input-group label="Type">
        <t-select
          v-model="form.type"
          :options="[
            { value: 'challenge-suggestion', text: 'Challenge suggestion' },
            { value: 'tutorial-category-suggestion', text: 'Tutorial category suggestion' },
            { value: 'other-suggestion', text: 'Other suggestion' },
            { value: 'bug-report', text: 'Bug report' },
            { value: 'feature-request', text: 'Feature request' },
            { value: 'other', text: 'Other' }
          ]"
        />
        <has-error :form="form" field="type"/>
      </t-input-group>

      <t-input-group label="Details">
        <t-textarea
          v-model="form.details"
        />
        <has-error :form="form" field="details"/>
      </t-input-group>

    </form>

    <template slot="footer">
      <t-button :class="{ 'btn-loading': form.busy }" variant="primary" @click="send()">
        Send
      </t-button>
    </template>

  </t-modal>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'

export default {
  data () {
    return {
      show: false,
      form: new Form({
        type: 'suggestion',
        details: '',
        origin_url: null
      })
    }
  },

  mounted () {
    this.$bus.$on('showFeedbackModal', () => {
      this.form.clearErrors()
      this.show = true
    })
  },

  beforeDestroy () {
    this.$bus.$off('showFeedbackModal')
  },

  methods: {
    async send() {
      this.form.busy = true

      try {
        // Submit the feedback
        const response = await this.$axios.post('feedback', {
          type: this.form.type,
          details: this.form.details,
          origin_url: window.location.href
        })

        // Show success message
        swal.fire({
          type: 'success',
          title: 'Thank you!',
          showConfirmButton: false,
          timer: 1500
        })

        // Hide this modal
        this.$nextTick(() => {
          this.$refs.modal.hide()
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
