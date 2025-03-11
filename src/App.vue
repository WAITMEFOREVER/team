<template>
  <div id="app">
    <NavBar  v-if="$route.meta.showNavbar" />
    <router-view /> <!-- 这里是内容的展示区域，配合 Vue Router 使用 -->
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import { loadAuthData, clearAuthData } from '@/utils/storage'

export default {
  components: {
    NavBar
  },
  created () {
    const { user, token, expirationDate } = loadAuthData()

    if (user && token && expirationDate > new Date().getTime()) {
      // 自动登录
      this.$store.commit('setUser', user)
      this.$store.commit('setToken', token)
    } else {
      // 清除过期信息
      clearAuthData()
      this.$store.commit('clearUser')
    }
  }
}
</script>

<style>
/* 全局样式可以在这里调整 */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
