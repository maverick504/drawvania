<template>
  <t-modal
    ref="modal"
    v-model="show"
    header="Create post"
    footer-class="bg-gray-100 p-4 text-right"
    width="480"
    @before-close="beforeClose"
  >

    <div v-if="loading" class="text-primary text-center py-5">
      <div class="spinner" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <form v-else class="-mt-4">

      <error-alert :form="form" class="mt-4"/>

      <div class="form-group">
        <div class="bg-gray-900 text-center -mx-4">
          <div v-if="previewUrl" class="relative">
            <img :src="previewUrl" alt="Preview" class="w-full h-auto">
            <button
              type="button"
              class="absolute w-10 h-10 text-white text-center rounded-full"
              style="background-color: rgba(0, 0, 0, 0.25); top: 8px; right: 8px;"
              @click="clearFile()">
              <trash-2-icon class="mx-auto"/>
            </button>
          </div>
          <div v-else class="text-white pt-12 pb-10">
            <label class="inline-block bg-primary hover:bg-primary-lighter text-white px-6 py-3 rounded-full cursor-pointer mb-4">
              Select a file to upload <input type="file" accept="image/jpeg,image/jpg,image/x-png" hidden @change="onFileChange">
            </label>
            <div>
              valid formats: jpeg, jpg, png<br/>
              max file size: 5mb
            </div>
          </div>
        </div>
        <has-error :form="form" field="image"/>
      </div>

      <div v-if="parentPost" class="mt-4 mb-4">
        <div class="flex items-center">
          <div class="flex-initial flex-shrink-0 pr-2">
            <img :src="parentPost.media[0].variations['50x50f'].url" width="50" height="50" class="w-10 h-10 rounded">
          </div>
          <div class="flex-grow text-sm">
            redraw to a post of: <b>{{ parentPost.author.username }}</b>
          </div>
          <div class="flex-initial pl-2">
            <button type="button" class="text-gray-900 hover:text-primary p-1" @click="removeParentPost()">
              <x-icon/>
            </button>
          </div>
        </div>
        <has-error :form="form" field="parent_post_id"/>
      </div>

      <template v-if="completedChallenge">
        <div class="mt-4 mb-4">
          <div class="flex items-center">
            <div class="flex-initial flex-shrink-0 pr-2">
              <img src="~/assets/img/challenge_icon.png" width="50" height="50" class="w-10 h-10 rounded">
            </div>
            <div class="flex-grow text-sm">
              challenge overcome: <b>{{ completedChallenge.title }}</b>
            </div>
            <div class="flex-initial pl-2">
              <button type="button" class="text-gray-900 hover:text-primary p-1" @click="removeCompletedChallenge()">
                <x-icon/>
              </button>
            </div>
          </div>
          <has-error :form="form" field="completed_challenge_id"/>
        </div>
        <div class="mb-4">
          <span v-for="skill in completedChallenge.skillPoints" :style="{ 'color': skill.color }">
            {{ `+${skill.pivot.points} ${skill.name}` }}
          </span>
        </div>
      </template>

      <t-input-group class="mb-4">
        <t-textarea
          :class="{ 'border-danger': form.hasErrors('description') }"
          v-model="form.description"
          placeholder="Use this box to tell anything you want about this work. Append #hashtags to reference topics, events or contests."
          autocomplete="off"
          rows="3"
        />
        <has-error :form="form" field="description"/>
      </t-input-group>

      <t-input-group class="mb-4">
        <div class="flex">
          <t-button
            :class="{ 'bg-green text-white': form.restriction === 'no-restriction' }"
            base-class="w-1/3 border-t border-b border-l inline-flex justify-center px-6 py-3 bg-white border-green rounded-l hover:text-white hover:bg-green-lighter hover:border-green-lighter"
            @click="form.restriction = 'no-restriction'"
          >
            For all ages
          </t-button>
          <t-button
            :class="{ 'bg-orange text-white': form.restriction === 'moderate-mature-content' }"
            base-class="w-1/3 border-t border-b inline-flex justify-center px-6 py-3 bg-white border-orange hover:text-white hover:bg-orange-lighter hover:border-orange-lighter"
            @click="form.restriction = 'moderate-mature-content'"
          >
            +16
          </t-button>
          <t-button
            :class="{ 'bg-red text-white': form.restriction === 'strict-mature-content' }"
            base-class="w-1/3 border-t border-b border-r inline-flex justify-center px-6 py-3 bg-white border-red rounded-r hover:text-white hover:bg-red-lighter hover:border-red-lighter"
            @click="form.restriction = 'strict-mature-content'"
          >
            +18
          </t-button>
        </div>
        <has-error :form="form" field="restriction"/>
      </t-input-group>

      <t-input-group class="mb-4">
        <toggle
          id="create-post-modal--redrawable"
          :value="form.redrawable"
          v-model="form.redrawable"
          on-text="Redrawable"
          off-text="Redrawable"
          class="inline"
        />
        <span class="text-gray-600 align-middle cursor-help hover:text-gray-900" title="Allows other users to create their own versions of this work. A link to the original work will be visible.">
          <help-circle-icon size="1.2x" class="inline"/>
        </span>
        <has-error :form="form" field="redrawable"/>
      </t-input-group>

    </form>

    <template slot="footer">
      <t-button
        :disabled="form.busy"
        variant="danger"
        danger-class="bg-red text-white mr-2 hover:bg-red-lighter"
        @click="$refs.modal.hide()"
      >
        Cancel
      </t-button><!--
   --><t-button
        :class="{ 'btn-loading': form.busy }"
        variant="primary"
        @click="save()"
      >
        Post
      </t-button>
    </template>
  </t-modal>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'
import { Trash2Icon, HelpCircleIcon, XIcon } from 'vue-feather-icons'

export default {
  components: {
    Trash2Icon,
    HelpCircleIcon,
    XIcon
  },

  data: function () {
    return {
      show: false,
      loading: true,
      descriptionCharacterLimit: 280,
      parentPost: null,
      completedChallenge: null,
      previewUrl: null,
      form: new Form({
        parent_post_id: null,
        completed_challenge_id: null,
        image: null,
        description: '',
        restriction: 'no-restriction',
        redrawable: true
      })
    }
  },

  mounted () {
    this.$bus.$on('createPost', (options = {}) => {
      this.clearForm()
      this.loading = true
      this.show = true

      if('parentPostId' in options) {
        this.setParentPost(options.parentPostId)
      }

      if('completedChallengeRelationshipId' in options) {
        this.setCompletedChallenge(options.completedChallengeRelationshipId)
      }

      this.loading = false
    })
  },

  methods: {
    async setParentPost (parentPostId) {
      const response = await this.$axios.get(`/posts/${parentPostId}?with=author,media`)
      this.parentPost = response.data

      this.form.parent_post_id = this.parentPost.id
    },

    async setCompletedChallenge (completedChallengeRelationshipId) {
      const response = await this.$axios.get(`/completed-challenges/${completedChallengeRelationshipId}?with=skillPoints`)
      this.completedChallenge = response.data

      this.form.completed_challenge_id = this.completedChallenge.id
    },

    removeParentPost () {
      this.parentPost = null
      this.form.parent_post_id = null
    },

    removeCompletedChallenge () {
      this.completedChallenge = null
      this.form.completed_challenge_id = null
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
      this.removeCompletedChallenge()
      this.clearFile()
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
        if(this.form.completed_challenge_id) {
          formData.append('completed_challenge_id', this.form.completed_challenge_id)
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
          this.$refs.modal.hide()
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
