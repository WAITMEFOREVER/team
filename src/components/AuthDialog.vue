<template>
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
        <el-button plain @click="switchToRegister">还没账号，立即注册……</el-button>
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
        <el-button plain @click="switchToLogin">已有账号，立即登录……</el-button>
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
export default {
  name: 'AuthDialog',
  data () {
    return {
      loginDialogVisible: false, // 控制登录弹窗显示
      registerDialogVisible: false, // 控制注册弹窗显示
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
  methods: {
    // 切换至注册弹窗
    switchToRegister () {
      this.loginDialogVisible = false
      this.registerDialogVisible = true
    },
    // 切换至登录弹窗
    switchToLogin () {
      this.registerDialogVisible = false
      this.loginDialogVisible = true
    },
    // 关闭弹窗前的回调
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
    // 处理登录
    handleLogin () {
      // 这里添加登录逻辑
      console.log('登录表单数据：', this.loginForm)
      this.loginDialogVisible = false
    },
    // 处理注册
    handleRegister () {
      // 这里添加注册逻辑
      console.log('注册表单数据：', this.registerForm)
      this.registerDialogVisible = false
    }
  }
}
</script>
  <style scoped>
  .textleft {
    text-align: left;
  }
  </style>