<template>
  <b-modal id="create-post-modal" centered title="Create post" :hide-footer="loading" @hide="onHide">
    <div v-if="loading" class="text-primary text-center py-5">
      <div class="spinner-grow" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <b-form v-else style="margin-top: -16px;">

      <error-alert :form="form" class="mt-3"/>

      <b-form-group v-if="parentPost" horizontal class="mt-3">
        <div style="display: flex; flex-direction: row; align-items: center;">
          <div style="flex-grow: 0; padding-right: 8px;">
            <router-link :to="{ name: 'posts.show', params: { id: parentPost.id } }">
              <img style="width: 40px; height: 40px; border-radius: 6px;" :src="parentPost.media[0].variations['50x50'].url" alt="Post thumbnail image">
            </router-link>
          </div>
          <div style="flex-grow: 1;">
            <div style="display: block;">
              <router-link :to="{ name: 'posts.show', params: { id: parentPost.id } }">
                redraw to a post of @{{ parentPost.author.username }}
              </router-link>
            </div>
          </div>
          <div style="flex-grow: 0; padding-left: 8px;">
            <button type="button" @click="removeParentPost()" style="background-color: #fff; color: #45aaf2; border: none; width: 32px; height: 32px; border-radius: 50%; padding: 0;">
              <x-icon/>
            </button>
          </div>
        </div>
        <has-error :form="form" field="parent_post_id"/>
      </b-form-group>

      <b-form-group horizontal>
        <div class="text-center" style="background: #3d3d3d; margin: 0 -16px 0 -16px; padding: 16px 0;">
          <template v-if="previewUrl">
            <div style="width: 100%; max-width: 400px; height: auto; margin: auto; position: relative;">
              <img class="shadow" :src="previewUrl" style="width: 100%; height: auto;">
              <button type="button" @click="clearFile()" style="background-color: #3d3d3d33; color: #fff; border: none; width: 32px; height: 32px; border-radius: 50%; padding: 0; position: absolute; top: 8px; right: 8px;">
                <trash-2-icon/>
              </button>
            </div>
          </template>
          <div v-else style="padding: 48px 0; color: #fff;">
            <label class="btn btn-primary">
              Select a file to upload <input type="file" accept="image/jpeg,image/jpg,image/x-png" hidden @change="onFileChange">
            </label>
            <div>
              valid formats: jpeg, jpg, png<br/>
              max file size: 5mb
            </div>
          </div>
        </div>
        <has-error :form="form" field="image"/>
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
          Redrawable <help-circle-icon v-b-tooltip.hover title="Allows other users to create their own versions of this work. A link to the original work will be visible."/>
        </b-form-checkbox>
        <has-error :form="form" field="redrawable"/>
      </b-form-group>

    </b-form>

    <template slot="modal-footer">
      <b-button :disabled="form.busy" @click="$bvModal.hide('create-post-modal')">Cancel</b-button>
      <b-button :class="{ 'btn-loading': form.busy }" variant="primary" @click="save">Post</b-button>
    </template>
  </b-modal>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'
import { XIcon, Trash2Icon, HelpCircleIcon } from 'vue-feather-icons'

export default {
  components: {
    Trash2Icon,
    HelpCircleIcon,
    XIcon
  },

  data: function () {
    return {
      descriptionCharacterLimit: 280,
      loading: true,
      parentPost: null,
      previewUrl: null,
      form: new Form({
        parent_post_id: null,
        image: null,
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
    async open (parentPostId = null) {
      this.$bvModal.show('create-post-modal')

      this.clearForm()
      this.loading = true

      if(parentPostId) {
        const response = await this.$axios.get(`/posts/${parentPostId}?with=author,media`)
        this.parentPost = response.data

        this.form.parent_post_id = this.parentPost.id
      }

      this.loading = false
    },

    removeParentPost () {
      this.parentPost = null
      this.form.parent_post_id = null
    },

    onFileChange (e) {
      const file = e.target.files[0]

      this.form.image = file
      this.previewUrl = URL.createObjectURL(file)
    },

    clearFile () {
      this.form.image = null
      this.previewUrl = null
    },

    clearForm () {
      this.removeParentPost()
      this.clearFile()
      this.form.parent_post_id = null
      this.form.image = null
      this.form.description = ''
      this.form.restriction = 'no-restriction'
      this.form.redrawable = true

      this.form.clearErrors()
    },

    async save () {
      this.form.clearErrors()
      this.form.busy = true

      try {
        // Save the post
        let formData = new FormData()
        formData.append('file', this.form.image)
        formData.append('description', this.form.description)
        formData.append('restriction', this.form.restriction)
        formData.append('redrawable', this.form.redrawable)
        if(this.form.parent_post_id) {
          formData.append('parent_post_id', this.form.parent_post_id)
        }

        const response = await this.$axios.post('posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.post = response.data.data

        // Show success message
        swal.fire({
          type: 'success',
          title: 'Post created successfully!',
          showConfirmButton: false,
          timer: 1500
        })

        // Hide this modal
        this.$nextTick(() => {
          this.$bvModal.hide('create-post-modal')
        })

        // Fire confetti!
        this.$bus.$emit('fireConfetti')

        // Redirect to the created post.
        this.$router.push({ name: 'posts.show', params: { id: this.post.id } })
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
