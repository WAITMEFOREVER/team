<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo">Steam Games</router-link>
    </div>
    <div class="navbar-search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索游戏"
        @keyup.enter="search"
      />
      <button @click="search">搜索</button>
    </div>
    <div class="navbar-links">
      <router-link to="/">首页</router-link>
      <router-link to="/recommend">推荐</router-link>
      <router-link to="/about">关于</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  data () {
    return {
      searchQuery: '' // 搜索框输入内容
    }
  },
  methods: {
    search () {
      if (this.searchQuery.trim()) {
        // 触发搜索逻辑，例如跳转到搜索页面或调用 API
        this.$router.push({ path: '/search', query: { q: this.searchQuery } })
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
}

.navbar-brand .logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.navbar-search {
  display: flex;
  align-items: center;
}

.navbar-search input {
  padding: 8px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
}

.navbar-search button {
  padding: 8px 12px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.navbar-search button:hover {
  background-color: #777;
}

.navbar-links a {
  margin-left: 20px;
  color: white;
  text-decoration: none;
}

.navbar-links a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .navbar-search {
    width: 100%;
    margin: 10px 0;
  }
  .navbar-search input {
    flex: 1;
  }
  .navbar-links {
    margin-top: 10px;
  }
}
</style>