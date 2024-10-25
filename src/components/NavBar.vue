<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1"><router-link to="/">Home</router-link></el-menu-item>
    <el-menu-item index="2"><router-link to="/about">About</router-link></el-menu-item>
    <el-menu-item index="3"><router-link to="/services">Services</router-link></el-menu-item>
    <el-menu-item index="4"><router-link to="/contact">Contact</router-link></el-menu-item>

    <!-- 右侧登录和注册 -->
    <div class="auth-buttons">
      <el-button plain type="primary" @click="loginDialogVisible = true">登 录</el-button>
      <el-button plain type="success" @click="registerDialogVisible = true" style="margin-left: 10px;">注 册</el-button>
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
        <el-input v-model="registerForm.username" placeholder="Enter your username"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input type="password" v-model="registerForm.password" placeholder="Enter your password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：">
        <el-input type="password" v-model="registerForm.confirmPassword" placeholder="Confirm your password"></el-input>
      </el-form-item>
    </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="registerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleRegister">注 册</el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script>
import { ElMessageBox } from 'element-plus' // 引入 ElMessageBox
export default {
  name: 'NavBar',
  data () {
    return {
      activeIndex: '',
      loginDialogVisible: true,
      registerDialogVisible: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  watch: {
    $route (to) {
      this.activeIndex = to.path
    }
  },
  methods: {
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
      this.registerDialogVisible = false // 关闭对话框
    }
  }
}
</script>

<style scoped>
.el-menu-demo {
  background-color: #409EFF;
  color: white;
  line-height: 60px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
}

.router-link-active {
  font-weight: bold;
  color: white;
}

.el-menu-item.is-active {
  background-color: #ffffff !important;
  color: #409EFF !important;
}

.el-menu-item {
  color: white;
}

.auth-buttons {
  margin-right: 30px;
}

.el-button {
  margin-left: 10px;
}
</style>
