<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo sticky-nav" mode="horizontal">
    <!-- Logo -->
    <div class="navbar-brand">
      <router-link to="/" class="logo">Steam Games</router-link>
    </div>
    <el-menu-item index="1"><router-link to="/">首页</router-link></el-menu-item>
    <el-menu-item index="2"><router-link to="/about">游戏推荐</router-link></el-menu-item>
    <el-menu-item index="3"><router-link to="/services">游戏数据可视化</router-link></el-menu-item>
    <div ref="searchContainer">
    <!-- 搜索框 -->
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索游戏..."
        class="search-input"
        @input="fetchSearchResults"
        @focus="showResults = true"
      />
      <button class="search-button" @click="search">搜索</button>
    </div>

    <!-- 搜索结果 -->
    <ul v-if="showResults && searchResults.length > 0" ref="searchResults" class="search-results">
      <li v-for="(result, index) in searchResults" :key="index" @click="selectResult(result)">
        {{ result }}
      </li>
    </ul>

    <!-- 无结果提示 -->
    <div v-else-if="showResults && searchQuery && searchResults.length === 0" class="no-results">
      没有找到相关结果。
    </div>
  </div>
    <!-- 语音切换按钮 -->
    <!-- <div class="language-switcher">
      <select v-model="selectedLanguage" @change="changeLanguage">
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </div> -->
    <!-- 右侧登录和注册 -->
    <div class="auth-buttons">
      <div v-if="user" style="display: inline-block;margin-right: 20px;">
      <span>欢迎{{ user.username }}！</span>
    </div>
      <div v-else style="display: inline-block;margin-right: 20px;flex:top;">
        <el-button @click="openLoginDialog">登录</el-button>
        <el-button @click="openRegisterDialog">注册</el-button>
      </div>
      <el-dropdown style="margin-top: 10px;">
        <span class="el-dropdown-link">
          <el-avatar :src="avatar|| defaultAvatar"/>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-if="user" @click="handleLogout">退出登录</el-dropdown-item>
            <el-dropdown-item v-else @click="openLoginDialog">游客请登录…</el-dropdown-item>
            <el-dropdown-item>我的游戏</el-dropdown-item>
            <el-dropdown-item @click.prevent="openProfile">个人中心</el-dropdown-item>
            <el-dropdown-item>消息提醒</el-dropdown-item>
            <el-dropdown-item>帮助与反馈</el-dropdown-item>
            <el-dropdown-item divided @click.prevent="openSettings">设置</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-menu>
<!-- 使用封装好的 AuthDialog 组件 -->
<AuthDialog ref="authDialog" />
</template>

<script>
// import { ElMessageBox } from 'element-plus'
import AuthDialog from '@/components/AuthDialog.vue'
import { mapState } from 'vuex'
import axios from 'axios'
import _ from 'lodash' // 引入 lodash 库
export default {
  name: 'NavBar',
  components: {
    AuthDialog
  },

  data () {
    return {
      activeIndex: '',
      selectedLanguage: 'zh', // 默认选中中文
      loginDialogVisible: false,
      registerDialogVisible: false,
      avatar: [],
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        steamID: ''
      },
      searchQuery: '',
      searchResults: [],
      showResults: false
    }
  },
  created () {
    this.fetchUserAvatar()
  },
  watch: {
    $route (to) {
      this.activeIndex = to.path
    },
    searchQuery () {
      this.fetchSearchResults()// 监听输入变化，调用防抖后的搜索函数
    }
  },
  computed: {
    ...mapState(['user'])// 从 Vuex Store 中获取用户信息
  },
  methods: {
    // 使用 Lodash 防抖
    fetchSearchResults: _.debounce(async function () {
      if (!this.searchQuery.trim()) {
        this.searchResults = []
        return
      }
      try {
        const response = await axios.get('http://127.0.0.1:5000/steam/search', {
          params: { q: this.searchQuery.trim() }
        })
        this.searchResults = response.data
      } catch (error) {
        console.error('搜索请求失败', error)
        this.searchResults = []
      }
    }, 300), // 300ms 延迟

    // 处理点击框外时隐藏搜索结果
    handleClickOutside (event) {
      setTimeout(() => { // 延迟确保点击选项时不会误触隐藏
        if (
          this.$refs.searchContainer &&
          !this.$refs.searchContainer.contains(event.target)
        ) {
          this.showResults = false
        }
      }, 100)
    },

    // 选择搜索结果
    selectResult (result) {
      this.searchQuery = result
      this.search()
    },

    // 跳转到搜索结果页（新标签）
    search () {
      if (this.searchQuery.trim()) {
        const searchUrl = this.$router.resolve({ path: '/search', query: { q: this.searchQuery.trim() } }).href
        window.open(searchUrl, '_blank')
        this.showResults = false
      }
    },
    async fetchUserAvatar () {
      const response = await axios.get(`http://127.0.0.1:5000/get_user_avatar?user_id=${this.user.id}`)
      this.avatar = response.data.avatar
    },
    openProfile () {
      const isLoggedIn = localStorage.getItem('token')
      if (isLoggedIn) {
        window.open('/profile', '_blank') // 在新标签页中打开个人中心
      } else {
        this.$message.warning('请先登录！') // 提示用户登录
      }
    },
    openSettings () {
      const isLoggedIn = localStorage.getItem('token')
      if (isLoggedIn) {
        window.open('/profile/settings', '_blank') // 在新标签页中打开个人中心
      } else {
        this.$message.warning('请先登录！') // 提示用户登录
      }
    },
    changeLanguage () {
      // 切换语言的逻辑
      console.log(`切换语言为: ${this.selectedLanguage}`)
    },
    // 打开登录弹窗
    openLoginDialog () {
      this.$refs.authDialog.loginDialogVisible = true
    },
    // 打开注册弹窗
    openRegisterDialog () {
      this.$refs.authDialog.registerDialogVisible = true
    },
    // 处理退出登录
    handleLogout () {
      // 清除本地存储的用户信息和 token
      localStorage.removeItem('user')
      localStorage.removeItem('token')

      // 清除 Vuex 中的用户信息和 token
      this.$store.commit('setUser', null)
      this.$store.commit('setToken', null)

      // 刷新页面，重新初始化应用状态
      window.location.reload()
    }
  },
  mounted () {
    // 监听文档点击事件
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount () {
    // 移除事件监听
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.el-menu-demo {
  background-color: #67C23A;
  color: white;
  line-height: 60px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
}

/* 使导航栏在滚动时固定在顶部 */
.sticky-nav {
  position: -webkit-sticky; /* For Safari */
  position: sticky;
  top: 0;
  z-index: 1000; /* 确保导航栏在其他内容之上 */
  width: 100%;
}

.el-menu-demo .navbar-brand .logo {
  padding: 10px;
  line-height: 60px;
}

.router-link-active {
  font-weight: bold;
  color: white;
}

.el-menu-item.is-active {
  background-color: #ffffff !important;
}

.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 0;
  color: #67C23A !important;
}

.el-menu-item {
  color: #fff !important;
}

.el-menu-item:hover {
  color: #686767 !important;
  background-color: #b3e19d !important;
}

.el-menu-item a {
  text-decoration: none;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  margin-right: 10px;
  margin-top:10px;
}

.search-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top:10px;
}

.search-button:hover {
  background-color: #0056b3;
}

.search-results {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 5px;
}

.search-results ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.search-results li {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  color: #333;
  list-style: none;
}

.search-results li:hover {
  background-color: #f5f5f5;
  color: #000;
}

.highlight {
  background-color: yellow;
  font-weight: bold;
}
/* 无结果提示 */
.no-results {
  padding: 10px;
  color: #666;
  font-style: italic;
}
.auth-buttons {
  margin-right: 30px;
}

.auth-buttons .el-button {
  background: #67C23A;
  border: 0;
}

.auth-buttons .el-button:hover {
  color: #686767 !important;
  background-color: none;
}

.el-button+.el-button{
  margin-left: 0;
  margin-right: 20px;
}
.textleft {
  text-align: center;
}
el-dropdown-item el-dropdown-menu a:hover{
  color:#409eff
}
</style>
