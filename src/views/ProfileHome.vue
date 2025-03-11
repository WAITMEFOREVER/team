<template>
  <h2>个人主页</h2>
  <table class="user-info-table">
    <tbody>
      <!-- 用户头像 -->
      <tr>
        <td><strong>用户头像</strong></td>
        <td>
          <div class="avatar-section">
            <img :src="user_data.avatar" alt="头像" class="avatar" @click="triggerAvatarInput" />
            <input type="file" ref="avatarInput" @change="handleAvatarChange" accept="image/*" style="display: none;" />
            <img v-if="previewAvatar" :src="previewAvatar" class="avatar-preview" style="display: none;" />
            <p class="avatar-hint">点击头像上传新照片</p>
          </div>
        </td>
      </tr>

      <!-- 用户名 -->
      <tr>
        <td><strong>用户名</strong></td>
        <td @click="openEditModal('username')">{{ user_data.username }}</td>
      </tr>
      <!-- 性别 -->
      <tr>
        <td><strong>性别</strong></td>
        <td @click="openEditModal('sex')">{{ getDisplaySex() }}</td>
      </tr>
      <!-- 邮箱 -->
      <tr>
        <td><strong>邮箱</strong></td>
        <td @click="openEditModal('email')">{{ user_data.email }}</td>
      </tr>

      <!-- Steam ID -->
      <tr>
        <td><strong>*Steam ID</strong></td>
        <td>{{ user_data.steam_id }}</td>
      </tr>

      <!-- 注册时间 -->
      <tr>
        <td><strong>*注册时间</strong></td>
        <td>{{ formatDate(user_data.created_at) }}</td>
      </tr>

      <!-- 最近登录时间 -->
      <tr>
        <td><strong>*最近登录</strong></td>
        <td>{{ formatDate(user_data.last_login) }}</td>
      </tr>

      <!-- 绑定第三方账号 -->
      <tr>
        <td><strong>绑定账号</strong></td>
        <td>
          <div class="third-party-accounts">
            <span v-if="user_data.steam_linked" class="account-item">
              <i class="fab fa-steam"></i> Steam
            </span>
            <span v-if="user_data.google_linked" class="account-item">
              <i class="fab fa-google"></i> Google
            </span>
            <button @click="manageAccounts">管理</button>
          </div>
        </td>
      </tr>

      <!-- 编辑资料按钮 -->
      <tr>
        <td></td>
        <td>
          *注·有“*”的项目不能更改
        </td>
      </tr>
    </tbody>
  </table>

  <!-- 编辑弹窗 -->
  <div v-if="isEditModalOpen" class="edit-modal" @click.self="closeEditModal">
    <div class="edit-modal-content">
      <span class="close" @click="closeEditModal">&times;</span>
      <h3>{{ getModalTitle() }}</h3>
      <template v-if="editField === 'sex'">
        <select v-model="editValue">
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
      </template>
      <template v-else>
        <input v-model="editValue" type="text" />
      </template>
      <button @click="saveEdit">保存</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user']) // 将 Vuex 中的 user 映射到组件的计算属性
  },
  data () {
    return {
      user_data: {
        id: '',
        username: '',
        email: '',
        avatar: '',
        steam_id: '',
        sex: '',
        created_at: '',
        last_login: '',
        steam_linked: false,
        google_linked: false
      },
      previewAvatar: '',
      isEditModalOpen: false,
      editField: '',
      editValue: ''
    }
  },
  created () {
    this.fetchUserData()
  },
  methods: {
    fetchUserData () {
      const userId = this.user.id // 从 Vuex 中获取用户 ID
      axios.get(`http://127.0.0.1:5000/user/${userId}`)
        .then(response => {
          this.user_data = response.data.user
          console.log(this.user_data)
        })
        .catch(error => {
          console.error('获取用户信息失败:', error)
        })
    },
    formatDate (dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString() // 根据本地格式显示日期
    },
    triggerAvatarInput () {
      this.$refs.avatarInput.click()
    },
    handleAvatarChange (event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.previewAvatar = e.target.result
          this.user.avatar = this.previewAvatar
        }
        reader.readAsDataURL(file)
      }
    },
    openEditModal (field) {
      this.editField = field
      this.editValue = this.user_data[field]
      this.isEditModalOpen = true
    },
    closeEditModal () {
      this.isEditModalOpen = false
    },
    getModalTitle () {
      switch (this.editField) {
        case 'username':
          return '修改用户名'
        case 'email':
          return '修改邮箱'
        case 'sex':
          return '修改性别'
        default:
          return ''
      }
    },
    getDisplaySex () {
      return this.user_data.sex === 'male' ? '男' : this.user_data.sex === 'female' ? '女' : this.user_data.sex
    },
    saveEdit () {
      this.user_data[this.editField] = this.editValue
      this.closeEditModal()
      // 发送更新请求到后端
      this.updateUserData()
    },
    updateUserData () {
      const userId = this.user.id
      axios.put(`http://127.0.0.1:5000/user/${userId}`, this.user_data)
        .then(response => {
          if (response.data.success) {
            console.log('用户数据更新成功:', response.data)
          } else {
            console.error('用户数据更新失败:', response.data.message)
            alert(response.data.message) // 显示错误信息
          }
        })
        .catch(error => {
          console.error('用户数据更新失败:', error)
          alert('更新失败，请检查网络或稍后重试')
        })
    },
    manageAccounts () {
      alert('管理绑定账号功能待实现')
    }
  }
}
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
}

.user-info-table {
  max-width: 600px;
  margin: 0 auto;
  border-collapse: collapse;
  width: 100%;
}

.user-info-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.user-info-table td:first-child {
  font-weight: bold;
  width: 30%;
}

.avatar-section {
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.avatar-hint {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.info-item button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.info-item button:hover {
  background-color: #3aa876;
}

.vip-badge {
  color: #ff9800;
  font-weight: bold;
}

.normal-badge {
  color: #666;
}

.third-party-accounts {
  display: flex;
  align-items: center;
}

.account-item {
  margin-right: 10px;
}

.edit-profile-button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.edit-profile-button:hover {
  background-color: #3aa876;
}

/* 编辑弹窗样式 */
.edit-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.edit-modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

.edit-modal-content h3 {
  margin-bottom: 10px;
}

.edit-modal-content input,
.edit-modal-content select {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
}

.edit-modal-content button {
  padding: 5px 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-modal-content button:hover {
  background-color: #3aa876;
}
</style>