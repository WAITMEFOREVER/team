import { loadAuthData, clearAuthData } from './storage'

export const autoLogin = (store) => {
  const { user, token, expirationDate } = loadAuthData()

  if (user && token && expirationDate) {
    const now = new Date().getTime()
    if (now < expirationDate) {
      // 自动登录
      store.commit('setUser', user)
      store.commit('setToken', token)
    } else {
      // 信息过期，清除本地存储
      clearAuthData()
      store.commit('clearUser')
    }
  }
}