<template>
  <div class="app-container">
    <el-button plain type="primary" @click="loginDialogVisible = true">登录</el-button>
    <el-button plain type="success" @click="registerDialogVisible = true" style="margin-left: 10px;">注册</el-button>
    <!-- 登录弹窗 -->
    <el-dialog
      title="提示"
      v-model="loginDialogVisible"
      :before-close="handleClose"
    >
    <el-form>
      <el-form-item label="Username">
        <el-input v-model="loginForm.username" placeholder="Enter your username"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="loginForm.password" placeholder="Enter your password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">Login</el-button>
      </el-form-item>
    </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="loginDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="loginDialogVisible = false">确 定</el-button>
        </div>
      </template>
    </el-dialog>
     <!-- 注册弹窗 -->
    <el-dialog
      title="提示"
      v-model="registerDialogVisible"
      :before-close="handleClose"
    >
    <el-form>
      <el-form-item label="Username">
        <el-input v-model="registerForm.username" placeholder="Enter your username"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="registerForm.password" placeholder="Enter your password"></el-input>
      </el-form-item>
      <el-form-item label="Confirm Password">
        <el-input type="password" v-model="registerForm.confirmPassword" placeholder="Confirm your password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleRegister">Register</el-button>
      </el-form-item>
    </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="registerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="registerDialogVisible = false">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessageBox } from 'element-plus' // 引入 ElMessageBox

export default {
  data () {
    return {
      loginDialogVisible: false,
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
  methods: {
    handleClose (done) {
      ElMessageBox.confirm('确定关闭吗？').then(() => {
        done() // 确认后关闭 Dialog
        console.info("点击右上角 'X'，取消按钮或遮罩层时触发")
      }).catch(() => {
        console.log('点击取消时触发')
      })
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
