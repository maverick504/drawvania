<template>
  <t-modal ref="modal" v-model="show" header="Edit post" footerClass="bg-gray-100 p-4 text-right" width="540" @before-close="beforeClose">
    <div v-if="loading" class="text-primary text-center py-5">
      <div class="spinner" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <form v-else class="-mt-4">

      <error-alert :form="form" class="mt-4"/>

      <div v-if="post.parentPost" class="form-group mt-4">
        <div class="flex items-center text-sm">
          <div class="flex-initial pr-2">
            <img :src="post.parentPost.media[0].variations['50x50f'].url" width="50" height="50" class="w-10 h-10 rounded">
          </div>
          <div class="flex-grow">
            redraw to a post of <b>{{ post.parentPost.author.username }}</b>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="bg-gray-900 py-4 text-center -mx-4">
          <div class="relative w-full h-auto mx-auto" style="max-width: 400px;">
            <img :src="post.media[0].variations['1280w'].url" alt="Preview" class="w-full h-auto shadow-lg">
          </div>
        </div>
      </div>

      <form-group>
        <t-textarea
          :class="{ 'border-danger': form.hasErrors('description') }"
          v-model="form.description"
          placeholder="Use this box to comment anything you want about this work."
          autocomplete="off"
          rows="3"
        />
        <has-error :form="form" field="description"/>
      </form-group>

      <form-group>
        <div class="flex">
          <t-button
            :class="{ 'bg-green text-white': form.restriction === 'no-restriction' }"
            baseClass="w-1/3 border-t border-b border-l inline-flex justify-center px-6 py-3 bg-white border-green rounded-l hover:text-white hover:bg-green-lighter hover:border-green-lighter"
            @click="form.restriction = 'no-restriction'"
          >
            For all ages
          </t-button>
          <t-button
            :class="{ 'bg-orange text-white': form.restriction === 'moderate-mature-content' }"
            baseClass="w-1/3 border-t border-b inline-flex justify-center px-6 py-3 bg-white border-orange hover:text-white hover:bg-orange-lighter hover:border-orange-lighter"
            @click="form.restriction = 'moderate-mature-content'"
          >
            +16
          </t-button>
          <t-button
            :class="{ 'bg-red text-white': form.restriction === 'strict-mature-content' }"
            baseClass="w-1/3 border-t border-b border-r inline-flex justify-center px-6 py-3 bg-white border-red rounded-r hover:text-white hover:bg-red-lighter hover:border-red-lighter"
            @click="form.restriction = 'strict-mature-content'"
          >
            +18
          </t-button>
        </div>
        <has-error :form="form" field="restriction"/>
      </form-group>

      <form-group>
        <toggle
          :value="form.redrawable"
          v-model="form.redrawable"
          id="edit-post-modal-redrawable"
          on-text="Redrawable"
          off-text="Redrawable"
          class="inline"
        />
        <span class="text-gray-600 align-middle cursor-help hover:text-gray-900" title="Allows other users to create their own versions of this work. A link to the original work will be visible.">
          <help-circle-icon size="1.2x" class="inline"/>
        </span>
        <has-error :form="form" field="redrawable"/>
      </form-group>

    </form>

    <template slot="footer">
      <t-button :disabled="form.busy" variant="danger" danger-class="bg-red text-white mr-2 hover:bg-red-lighter" @click="$refs.modal.hide()">
        Cancel
      </t-button><!--
   --><t-button :class="{ 'btn-loading': form.busy }" variant="primary" @click="save()">
        Save
      </t-button>
    </template>
  </t-modal>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'
import { HelpCircleIcon } from 'vue-feather-icons'

export default {
  components: {
    HelpCircleIcon
  },

  data: function () {
    return {
      show: false,
      descriptionCharacterLimit: 280,
      loading: true,
      post: null,
      form: new Form({
        description: '',
        restriction: 'no-restriction',
        redrawable: true
      })
    }
  },

  mounted () {
    this.$bus.$on('editPost', async (postId) => {
      this.form.clearErrors()
      this.post = null

      this.loading = true

      this.show = true

      const response = await this.$axios.get(`posts/${postId}?with=author,media,parentPost.author,parentPost.media`)
      this.post = response.data

      this.form.description = this.post.description
      this.form.restriction = this.post.restriction
      this.form.redrawable = this.post.redrawable

      this.loading = false
    })
  },

  methods: {
    async save () {
      this.form.clearErrors()
      this.form.busy = true

      try {
        // Save the post
        const response = await this.$axios.patch(`posts/${this.post.id}`, {
          description: this.form.description,
          restriction: this.form.restriction,
          redrawable: this.form.redrawable
        })

        // Show success message
        swal.fire({
          type: 'success',
          title: 'Post updated successfully!',
          showConfirmButton: false,
          timer: 1500
        })

        // Hide this modal
        this.$nextTick(() => {
          this.$refs.modal.hide()
        })

        // Redirect to the edited post.
        setTimeout(() => {
          this.$router.go({ name: 'posts.show', params: { id: this.post.id } })
        }, 1000)
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
