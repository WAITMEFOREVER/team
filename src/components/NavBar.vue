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
      <el-button plain @click="loginDialogVisible = true" style="display: inline-block;">登 录/注 册</el-button>
      <el-dropdown style="display: inline-block;margin-top: 10px;">
        <span class="el-dropdown-link">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="loginDialogVisible = true">游客请登录…</el-dropdown-item>
            <el-dropdown-item>我的游戏</el-dropdown-item>
            <el-dropdown-item>消息提醒</el-dropdown-item>
            <el-dropdown-item>帮助与反馈</el-dropdown-item>
            <el-dropdown-item divided>设置</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-menu>

  <!-- 登录弹窗 -->
  <el-dialog
    title="登录"
    v-model="loginDialogVisible"
    :before-close="handleClose"
  >
    <el-form>
      <el-form-item label="用户名：">
        <el-input v-model="loginForm.username" placeholder="请输入你的用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
    </el-form>
    <div class="textleft">
      <el-button plain @click="loginDialogVisible = false, registerDialogVisible = true">还没账号，立即注册……</el-button>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="loginDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleLogin">登 录</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 注册弹窗 -->
  <el-dialog
    title="注册"
    v-model="registerDialogVisible"
    :before-close="handleClose"
  >
    <el-form>
      <el-form-item label="用户名：">
        <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input type="password" v-model="registerForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：">
        <el-input type="password" v-model="registerForm.confirmPassword" placeholder="确认您的密码"></el-input>
      </el-form-item>
      <el-form-item label="steamID：">
        <el-input v-model="registerForm.steamID" placeholder="请输入你的steamID"></el-input>
        <el-text type="info">*steamID：是唯一标识steam用户的id,例：“76561199281289196”</el-text>
      </el-form-item>
    </el-form>
    <div class="textleft">
      <el-button plain @click="loginDialogVisible = true, registerDialogVisible = false">已有账号，立即登录……</el-button>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="registerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRegister">注 册</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ElMessageBox } from 'element-plus'

export default {
  name: 'NavBar',
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
  methods: {
    changeLanguage () {
      // 切换语言的逻辑
      console.log(`切换语言为: ${this.selectedLanguage}`)
    },
    handleClose (done) {
      ElMessageBox.confirm('确定关闭吗？').then(() => {
        done() // 确认后关闭 Dialog
        console.info("点击右上角 'X'，取消按钮或遮罩层时触发")
      }).catch(() => {
        console.log('点击取消时触发')
      })
    },
    handleLogin () {
      console.log('Logging in:', this.loginForm)
      this.loginDialogVisible = false // 关闭对话框
    },
    handleRegister () {
      console.log('Registering:', this.registerForm)
      this.registerDialogVisible = false// 关闭对话框
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

.el-button {
  margin-left: 10px;
}

.textleft {
  text-align: center;
}
</style>
