// getters
export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },

  skills(state) {
    return state.skills
  }
}


// mutations
export const mutations = {
  UPDATE_USER (state, { user }) {
    state.auth.user = user
  },

  UPDATE_SKILLS (state, { skills }) {
    state.skills = skills
  }
}

// actions
export const actions = {
  updateUser ({ commit }, payload) {
    commit('UPDATE_USER', payload)
  },

  updateSkills ({ commit }, payload) {
    commit('UPDATE_SKILLS', payload)
  }
}
