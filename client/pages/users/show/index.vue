<template>
  <div>
    <div class="bg-white py-8">
      <div class="container mx-auto flex items-center">
        <div class="flex-initial pr-8">
          <avatar 
            :user="user" 
            size="40"/>
        </div>
        <div class="flex-grow">
          <div class="inline-flex items-center">
            <h1 class="inline-block text-3xl font-bold">{{ user.username }}</h1>
            <span 
              v-if="user.upgraded_premium_at" 
              class="inline-block bg-gold font-normal text-sm text-white px-2 rounded-full ml-1">premium</span>
            <router-link
              v-if="isAuthenticated && user.id === loggedInUser.id"
              :to="{ name: 'settings.profile' }"
              class="ml-4 t-button t-button-size-default inline-block rounded border inline-flex justify-center items-center px-4 py-1 bg-white border-gray-400 hover:bg-gray-100 hover:border-gray-500"
            >
              Edit Profile
            </router-link>
            <follow-button
              v-else
              :logged-in-user-is-follower.sync="user.logged_in_user_is_follower"
              :total-followers.sync="user.total_followers"
              :follow-endpoint="`/users/${user.username}/follow`"
              :unfollow-endpoint="`/users/${user.username}/unfollow`"
              base-class="ml-4 t-button t-button-size-default inline-block rounded border inline-flex justify-center items-center px-4 py-1 bg-white border-gray-400 hover:bg-gray-100 hover:border-gray-500"
            />
          </div>
          <div class="mt-2">
            <span class="text-lg mr-4"><b>{{ user.total_posts }}</b> posts</span><!--
         --><button 
v-if="user.total_followers > 0" 
class="text-lg hover:text-primary mr-4" 
@click="followersClicked"><b>{{ user.total_followers }}</b> followers</button><!--
         --><span 
v-else 
class="text-lg mr-4"><b>{{ user.total_followers }}</b> followers</span><!--
         --><button 
v-if="user.total_followings > 0" 
class="text-lg hover:text-primary mr-4" 
@click="followingsClicked"><b>{{ user.total_followings }}</b> following</button><!--
         --><span 
v-else 
class="text-lg mr-4"><b>{{ user.total_followings }}</b> following</span>
          </div>
          <p 
            v-if="user.location" 
            class="mt-2"><map-pin-icon 
              size="1x" 
              class="inline"/> {{ user.location }}</p>
          <p class="mt-2">{{ user.about ? user.about : "This user has not yet written a bio..." }}</p>
        </div>
      </div>
    </div>
    <div class="border-t">
      <div class="container mx-auto">
        <div class="block text-center">
          <router-link 
            :to="{ name: 'users.show', params: { username: user.username } }" 
            class="inline-block text-gray-900 border-t-4 border-primary hover:text-primary px-6 py-4"><b class="mr-1">{{ user.total_posts }}</b>Posts</router-link>
        </div>
      </div>
    </div>
    <div class="container mx-auto">
      <div 
        v-if="posts.data.length > 0" 
        class="pt-6 pb-8">
        <div class="flex flex-wrap pb-4 -mx-2">
          <div 
            v-for="post in posts.data" 
            :key="post.id" 
            class="w-1/4 px-2 pb-4">
            <nuxt-link 
              :to="{ name: 'posts.show', params: { id: post.id } }" 
              class="illustration-thumbnail">
              <lazy-img
                :src="post.media[0].variations['300x300f'].url"
                :width="300"
                :height="300"
                alt="Post's image"
              >
                <div class="overlay">
                  <div class="overlay-content">
                    <div class="block mt-2">
                      {{ post.total_comments }} <message-circle-icon class="inline-block"/>
                    </div>
                    <div class="block mt-2">
                      {{ post.total_likes }} <heart-icon 
                        :class="{ 'filled text-red': post.logged_in_user_liked }" 
                        class="inline-block"/>
                    </div>
                  </div>
                </div>
              </lazy-img>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div 
        v-else 
        class="text-center py-8">
        <image-icon 
          size="4x" 
          class="mx-auto"/>
        <p class="mt-2">This user doesn't have any posts yet.</p>
      </div>
    </div>
    <followers-modal/>
    <followings-modal/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'
import FollowButton from '@/components/FollowButton.vue'
import LazyImg from '@/components/LazyImg.vue'
import FollowersModal from '@/components/modals/FollowersModal.vue'
import FollowingsModal from '@/components/modals/FollowingsModal.vue'
import { MapPinIcon, ImageIcon, HeartIcon, MessageCircleIcon } from 'vue-feather-icons'

export default {
  components: {
    Avatar,
    FollowButton,
    LazyImg,
    FollowersModal,
    FollowingsModal,
    MapPinIcon,
    ImageIcon,
    HeartIcon,
    MessageCircleIcon
  },

  data: function () {
    return {
      user: null,
      posts: null
    }
  },

  computed: {
    ...mapGetters([ 'isAuthenticated', 'loggedInUser' ])
  },

  async asyncData ({ $axios, params, error }) {
    try {
      var { data } = await $axios.get(`/users/${params.username}`)
      const user = data

      var { data } = await $axios.get(`/users/${params.username}/posts`)
      const posts = data

      return {
        user: user,
        posts: posts
      }
    } catch (err) {
      return error({ statusCode: err.response.status })
    }
  },

  methods: {
    followersClicked () {
      this.$bus.$emit('showFollowersModal', `/users/${this.user.username}/followers`)
    },

    followingsClicked() {
      this.$bus.$emit('showFollowingsModal', `/users/${this.user.username}/followings`)
    }
  }
}
</script>
