<template>
  <b-modal id="edit-post-modal" centered title="Edit post" :hide-footer="loading" @hide="onHide">
    <div v-if="loading" class="text-primary text-center py-5">
      <div class="spinner-grow" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <b-form v-else style="margin-top: -16px; padding-top: 16px;">

      <error-alert :form="form"/>

      <b-form-group v-if="post.parentPost" horizontal>
        <div style="display: flex; flex-direction: row; align-items: center;">
          <div style="flex-grow: 0; padding-right: 8px;">
            <router-link :to="{ name: 'posts.show', params: { id: post.parentPost.id } }">
              <img style="width: 40px; height: 40px; border-radius: 6px;" :src="post.parentPost.media[0].variations['50x50'].url" alt="Post thumbnail image">
            </router-link>
          </div>
          <div style="flex-grow: 1;">
            <div style="display: block;">
              <router-link :to="{ name: 'posts.show', params: { id: post.parentPost.id } }">
                redraw to a post of @{{ post.parentPost.author.username }}
              </router-link>
            </div>
          </div>
        </div>
      </b-form-group>

      <b-form-group v-if="post.media.length > 0" horizontal>
        <div class="text-center" style="background: #3d3d3d; color: #fff; margin: 0 -16px 0 -16px; padding: 16px 0;">
          <div style="width: 100%; max-width: 400px; height: auto; margin: auto; position: relative;">
            <img :src="post.media[0].variations['900w'].url" style="width: 100%; height: auto;">
          </div>
          <small>You cannot modify post's media.</small>
        </div>
      </b-form-group>

      <b-form-group horizontal>
        <textarea
          v-model="form.description"
          class="form-control"
          placeholder="Use this box to comment anything you want about this work."
          rows="3"
        ></textarea>
        <has-error :form="form" field="description"/>
      </b-form-group>

      <b-form-group horizontal>
        <b-dropdown :variant="restrictionDropdown.variant" :text="restrictionDropdown.text">
          <b-dropdown-item @click="form.restriction='no-restriction'">For all ages</b-dropdown-item>
          <b-dropdown-item @click="form.restriction='moderate-mature-content'">Moderate mature content</b-dropdown-item>
          <b-dropdown-item @click="form.restriction='strict-mature-content'">Strict mature content</b-dropdown-item>
        </b-dropdown>
        <has-error :form="form" field="restriction"/>
      </b-form-group>

      <b-form-group horizontal class="mb-0">
        <b-form-checkbox v-model="form.redrawable">
          Redrawable <help-circle-icon v-b-tooltip.hover title="Allows other users to create their own versions of this work. A link to the original work will be visible. This option cannot be removed once selected."/>
        </b-form-checkbox>
        <has-error :form="form" field="redrawable"/>
      </b-form-group>

    </b-form>

    <template slot="modal-footer">
      <b-button :disabled="form.busy" @click="$bvModal.hide('create-post-modal')">Cancel</b-button>
      <b-button :class="{ 'btn-loading': form.busy }" variant="primary" @click="save">Update</b-button>
    </template>
  </b-modal>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'
import { XIcon, HelpCircleIcon } from 'vue-feather-icons'

export default {
  components: {
    XIcon,
    HelpCircleIcon
  },

  data: function () {
    return {
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

  computed: {
    restrictionDropdown () {
      if(this.form.restriction === 'moderate-mature-content') {
        return {
          variant: 'warning',
          text: 'Moderate mature content'
        }
      } else if(this.form.restriction === 'strict-mature-content') {
        return {
          variant: 'danger',
          text: 'Strict mature content'
        }
      }

      return {
        variant: 'success',
        text: 'For all ages'
      }
    }
  },

  methods: {
    async open (id) {
      this.$bvModal.show('edit-post-modal')

      this.loading = true

      const response = await this.$axios.get(`/posts/${id}?with=media,parentPost.author,parentPost.media`)
      this.post = response.data

      this.form.description = this.post.description
      this.form.restriction = this.post.restriction
      this.form.redrawable = this.post.redrawable
      this.form.clearErrors()

      this.loading = false
    },

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
          this.$bvModal.hide('edit-post-modal')
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

    onHide (bvModalEvt) {
      if(this.form.busy) {
        bvModalEvt.preventDefault()
      }
    }
  }
}
</script>
