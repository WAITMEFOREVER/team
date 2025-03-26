import { createStore } from 'vuex' // 使用 Vue 3 的 Vuex

export default createStore({
  namespaced: true, // 开启命名空间
  state: {
    user: null,
    token: null
  },
  getters: {
    userInfo: state => state.user // 添加 userInfo 以供组件使用
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