<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo sticky-nav" mode="horizontal">
    <!-- Logo -->
    <div class="navbar-brand">
      <router-link to="/" class="logo">Steam Games</router-link>
    </div>
    <el-menu-item index="1"><router-link to="/">首页</router-link></el-menu-item>
    <el-menu-item index="2"><router-link to="/about">游戏推荐</router-link></el-menu-item>
    <el-menu-item index="3"><router-link to="/services">游戏数据可视化</router-link></el-menu-item>
    <!-- 搜索框 -->
    <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索..."
          class="search-input"
        />
        <button class="search-button">搜索</button>
      </div>
    <!-- 语音切换按钮 -->
    <div class="language-switcher">
      <select v-model="selectedLanguage" @change="changeLanguage">
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </div>
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
          <el-avatar :src="(user && user.avatar) || defaultAvatar"/>
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
            <el-dropdown-item divided>设置</el-dropdown-item>
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
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        steamID: ''
      }
    }
  },
  watch: {
    $route (to) {
      this.activeIndex = to.path
    }
  },
  computed: {
    ...mapState(['user'])// 从 Vuex Store 中获取用户信息
  },
  methods: {
    openProfile () {
      const isLoggedIn = localStorage.getItem('token')
      if (isLoggedIn) {
        window.open('/profile', '_blank') // 在新标签页中打开个人中心
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
