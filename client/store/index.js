// getters
export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  }
}


// mutations
export const mutations = {
  UPDATE_USER (state, { user }) {
    state.auth.user = user
  }
}

// actions
export const actions = {
  updateUser ({ commit }, payload) {
    commit('UPDATE_USER', payload)
  }
}
