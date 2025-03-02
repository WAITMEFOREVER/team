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
        <el-alert title="steamID：是唯一标识steam用户的id,例：“76561199281289196”" type="info" :closable="false" />
      </el-form-item>
      <el-form-item label="email：">
        <el-input v-model="registerForm.email" placeholder="请输入你的email"></el-input>
      </el-form-item>
      <div id="sex">
        <input type="radio" id="male" value="male" v-model="picked" />
        <label for="male">男</label>
        <input type="radio" id="female" value="female" v-model="picked" />
        <label for="female">女</label>
      </div>
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
import { ElMessageBox } from 'element-plus'
import axios from 'axios'
import { saveAuthData } from '@/utils/storage'

export default {
  name: 'AuthDialog',
  data () {
    return {
      loginDialogVisible: false, // 控制登录弹窗显示
      registerDialogVisible: false, // 控制注册弹窗显示
      picked: 'male', // 默认性别为男
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        steamID: '',
        email: ''
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
      ElMessageBox.confirm('确认关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          done()
        })
        .catch(() => {
          console.log('取消关闭')
        })
    },
    validateUsername (username) {
      if (!username) {
        this.usernameError = '用户名不能为空'
        return false
      }

      if (username.length > 20) {
        this.usernameError = '用户名长度不能超过 20 个字符'
        return false
      }

      const pattern = /^[a-zA-Z0-9_-]+$/
      if (!pattern.test(username)) {
        this.usernameError = '用户名只能包含字母、数字、下划线和短横线'
        return false
      }

      this.usernameError = ''
      return true
    },
    // 处理注册
    async handleRegister () {
      // 表单验证
      if (
        !this.registerForm.username ||
        !this.registerForm.password ||
        !this.registerForm.confirmPassword ||
        !this.registerForm.steamID
      ) {
        this.$message.error('所有字段均为必填项')
        return
      }

      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.$message.error('两次输入的密码不一致')
        return
      }

      try {
        // 调用注册 API
        const response = await fetch('http://127.0.0.1:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.registerForm.username,
            password: this.registerForm.password,
            steamID: this.registerForm.steamID,
            email: this.registerForm.email,
            sex: this.picked
          })
        })

        const result = await response.json()

        if (result.success) {
          this.$message.success('注册成功')
          this.registerDialogVisible = false // 关闭注册弹窗
        } else {
          this.$message.error(result.message || '注册失败')
        }
      } catch (error) {
        console.error('注册请求失败：', error)
        this.$message.error('注册请求失败，请稍后重试')
      }
    },
    // 处理登录
    async handleLogin () {
      try {
        const response = await axios.post('http://127.0.0.1:5000/login', this.loginForm)
        if (response.data.success) {
        // 登录成功
          this.$message.success('登录成功')
          this.loginDialogVisible = false

          const user = response.data.user
          const token = response.data.token
          const expirationDate = new Date().getTime() + 30 * 24 * 60 * 60 * 1000 // 30 天后

          // 保存用户信息到 localStorage
          saveAuthData(user, token, expirationDate)

          // 更新 Vuex 状态
          this.$store.commit('setUser', user)
          this.$store.commit('setToken', token)

          // 触发父组件更新用户状态
          this.$emit('login-success', user)
        } else {
        // 登录失败
          this.$message.error(response.data.message || '登录失败')
        }
      } catch (error) {
        console.error('登录失败:', error)
        this.$message.error('登录失败，请检查网络或稍后重试')
      }
    }
  }
}
</script>

<style scoped>
.textleft {
  text-align: left;
}
</style>
