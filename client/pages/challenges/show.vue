<template>
  <div class="flex">
    <div class="flex-grow relative bg-gray-100" style="height: calc(100vh - 57px); max-height: calc(100vh - 57px);">
      <div class="flex flex-col justify-center items-center h-full">
        <div v-if="challenge.references.length > 0" class="text-center mb-4">
          <div class="flex items-center mb-2">
            <button class="flex-initial p-4 text-gray-900 hover:text-primary" @click="previousReference">
              <arrow-left-icon size="2x"/>
            </button>
            <div class="flex items-center" style="width: 560px; height: 360px;">
              <img :src="currentReference.image_url" data-zoomable class="inline-block shadow-lg mx-auto" style="max-width: 560px; max-height: 360px;">
            </div>
            <button class="flex-initial p-4 text-gray-900 hover:text-primary" @click="nextReference">
              <arrow-right-icon size="2x"/>
            </button>
          </div>
          <a :href="currentReference.origin_url" target="_blank" class="text-gray-600 hover:text-primary">
            <external-link-icon size="1x" class="inline"/> {{ currentReference.site_name }}
          </a>
        </div>
        <div class="text-center">
          <stopwatch ref="stopwatch" :status.sync="stopwatchStatus" class="mb-2"/>
          <div class="flex flex-row justify-center items-center">
            <button type="button" class="inline-block w-10 h-10 flex justify-center items-center bg-gray-200 text-green rounded-full shadow focus:outline-none mx-1" @click="completeChallenge">
              <check-icon size="1.5x"/>
            </button>
            <button type="button" class="inline-block w-16 h-16 flex justify-center items-center bg-primary text-white rounded-full shadow-lg focus:outline-none mx-1" @click="togglePaused()">
              <play-icon v-if="stopwatchStatus=='paused'" size="1.5x"/>
              <pause-icon v-else size="1.5x"/>
            </button>
            <button type="button" class="inline-block w-10 h-10 flex justify-center items-center bg-gray-200 text-red rounded-full shadow focus:outline-none mx-1" @click="cancelChallenge">
              <x-icon size="1.5x"/>
            </button>
          </div>
        </div>
      </div>
      <div v-if="!challengeInProcess && !challengeCompleted" class="absolute inset-0 flex flex-col justify-center items-center h-full z-10" style="background: #ffffffdd;">
        <!--
        <img src="image.png" alt="uwu" style="width: auto; height: 192px; display: block;">
        -->
        <div class="w-96 bg-white p-8 text-center rounded-lg shadow-lg">
          <div class="text-xl mb-2">Do you accept this challenge?</div>
          <p class="mb-4">
            Prepare your pencil/pen and sheets of paper or your drawing tablet...
          </p>
          <t-button type="button" variant="primary" size="lg" class="rounded-full mr-2" @click="startChallenge">
            I'm ready!
          </t-button>
        </div>
      </div>
      <div v-if="challengeCompleted" class="absolute inset-0 flex flex-col justify-center items-center h-full z-10" style="background: #ffffffdd;">
        <!--
        <img src="image.png" alt="uwu" style="width: auto; height: 192px; display: block;">
        -->
        <div class="w-96 bg-white p-8 text-center rounded-lg shadow-lg">
          <div class="text-xl mb-2">Challenge overcome!</div>
          <template v-if="challenge.completed.post_id">
            <p class="mb-4">
              You already completed this challenge, but you can explore more challenges.
            </p>
            <router-link :to="{ name: 'challenges.index' }" class="rounded-full mr-2 router-link-active t-button t-button-size-lg inline-block rounded border inline-flex justify-center items-center px-8 py-4 text-lg bg-primary text-white border-primary hover:bg-primary-lighter hover:border-primary-lighter">
              Explore challenges
            </router-link>
          </template>
          <template v-else>
            <p class="mb-4">
              Now you can submit your work to share your progress with others... (optional)
            </p>
            <t-button type="button" variant="primary" size="lg" class="rounded-full mr-2" @click.prevent="$bus.$emit('createPost', { completedChallengeRelationshipId: challenge.completed.id })">
              Submit
            </t-button>
          </template>
        </div>
      </div>
    </div>
    <div class="flex-initial relative bg-white p-4 overflow-y-auto border-l" style="width: 400px; min-height: calc(100vh - 57px); max-height: calc(100vh - 57px);">
      <h1 class="text-xl mb-4">{{ challenge.title }}</h1>
      <div class="text-gray-600 mb-4">
        <span class="inline-block text-green mr-2">
          <bar-chart-icon size="1x" class="inline-block"/> {{ challenge.difficulty_level }} level
        </span>
        <span class="inline-block text-gray-600">
          <clock-icon size="1x" class="inline-block"/> {{ challenge.estimated_time }} min.
        </span>
      </div>
      <div class="mb-4">
        <span v-for="skill in challenge.skillPoints" :style="{ 'color': skill.color }">
          {{ `+${skill.pivot.points} ${skill.name}` }}
        </span>
      </div>
      <div class="challenge-body mb-4" v-html="challenge.body"></div>
      <!--
      <div class="absolute left-0 right-0 bottom-0 border-t">
        <img data-zoomable :src="currentReference.image_url">
        <div class="flex border-t">
          <button class="flex-initial p-4 text-gray-900 hover:text-primary" @click="previousReference">
            <arrow-left-icon size="1.5x"/>
          </button>
          <div class="flex-grow flex justify-center items-center">
            <a :href="currentReference.origin_url" target="_blank" class="text-gray-600 hover:text-primary">
              <external-link-icon size="1x" class="inline"/> {{ currentReference.site_name }}
            </a>
          </div>
          <button class="flex-initial p-4 text-gray-900 hover:text-primary" @click="nextReference">
            <arrow-right-icon size="1.5x"/>
          </button>
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mediumZoom from 'medium-zoom'
import Stopwatch from '@/components/Stopwatch.vue'
import { BarChartIcon, ClockIcon, ExternalLinkIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, PlayIcon, PauseIcon, XIcon } from 'vue-feather-icons'

export default {
  components: {
    Stopwatch,
    BarChartIcon,
    ClockIcon,
    ExternalLinkIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    PlayIcon,
    PauseIcon,
    XIcon
  },

  data: function () {
    return {
      challenge: null,
      challengeInProcess: false,
      challengeCompleted: false,
      stopwatchStatus: 'stopped', // Possible statuses are: stopped, active and paused.
      currentReferenceIndex: 0
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated']),

    currentReference () {
      if(this.challenge.references.length === 0) {
        return
      }

      return this.challenge.references[this.currentReferenceIndex]
    }
  },

  async asyncData ({ $axios, params, error }) {
    try {
      const response = await $axios.get(`/challenges/${params.id}?with=skillPoints,references`)
      const challenge = response.data

      return {
        challenge: challenge,
        challengeCompleted: challenge.completed ? 1 : 0
      }
    } catch (err) {
      return error({ statusCode: err.response.status })
    }
  },

  mounted () {
    this.$nextTick(() => {
      mediumZoom('[data-zoomable]', {
        margin: 0,
        background: '#4444'
      })
    })
  },

  methods: {
    startChallenge () {
      if(!this.isAuthenticated) {
        this.$bus.$emit('showLoginModal')
        return
      }

      this.challengeInProcess = true
      this.stopwatchStatus = 'active'
    },

    async completeChallenge () {
      this.stopwatchStatus = 'stopped'

      const response = await this.$axios.post(`challenges/${this.challenge.id}/mark-as-complete`, {
        time_taken: this.$refs.stopwatch.secondsEllapsed
      })

      this.challenge.completed = response.data

      this.challengeInProcess = false
      this.challengeCompleted = true
    },

    cancelChallenge () {
      this.stopwatchStatus = 'stopped'
      this.challengeInProcess = false
    },

    togglePaused () {
      if(this.stopwatchStatus == 'paused') {
        this.stopwatchStatus = 'active'
      } else {
        this.stopwatchStatus = 'paused'
      }
    },

    previousReference () {
      this.currentReferenceIndex--
      if(this.currentReferenceIndex < 0) {
        this.currentReferenceIndex = (this.challenge.references.length - 1)
      }
    },

    nextReference () {
      this.currentReferenceIndex++
      if(this.currentReferenceIndex > (this.challenge.references.length - 1)) {
        this.currentReferenceIndex = 0
      }
    }
  }
}
</script>
