<template>
  <router-link :to="{ name: 'challenges.show', params: { id: challenge.id } }" class="flex flex-col h-full bg-white p-6 rounded-lg shadow mb-4">
    <div class="mb-2">
      <h2 class="inline font-semibold text-gray-900 text-lg align-middle mr-1">
        {{ challenge.title }}
      </h2><span v-if="challenge.times_completed > 0" class="text-primary">
        Completed
      </span>
    </div>
    <div class="text-gray-600">
      <span class="inline-block text-green mr-2">
        <bar-chart-icon size="1x" class="inline-block"/> {{ challenge.difficulty_level }} level
      </span>
      <span class="inline-block text-gray-600">
        <clock-icon size="1x" class="inline-block"/> {{ challenge.estimated_time }} min.
      </span>
    </div>
  </router-link>
</template>

<script>
import { BarChartIcon, ClockIcon } from 'vue-feather-icons'

export default {
  components: {
    BarChartIcon,
    ClockIcon
  },

  props: {
    challenge: { type: Object, required: true }
  }
}
</script>
