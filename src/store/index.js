import { createStore } from 'vuex' // 使用 Vue 3 的 Vuex

export default createStore({
  state: {
    user: null,
    token: null
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setToken (state, token) {
      state.token = token
    },
    clearUser (state) {
      state.user = null
      state.token = null
    }
  },
  actions: {
    login ({ commit }, { user, token }) {
      commit('setUser', user)
      commit('setToken', token)
    },
    logout ({ commit }) {
      commit('clearUser')
    }
  }
})