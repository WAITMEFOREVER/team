<template>
  <div id="app">
    <NavBar />
    <router-view /> <!-- 这里是内容的展示区域，配合 Vue Router 使用 -->
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  components: {
    NavBar
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
