<template>
  <div class="settings-page">
    <h1>设置与安全</h1>

    <!-- 修改密码 -->
    <div class="settings-section">
      <h2>修改密码</h2>
      <form @submit.prevent="changePassword">
        <div class="form-group">
          <label for="current-password">当前密码</label>
          <input
            v-model="password.current"
            type="password"
            id="current-password"
            required
          />
        </div>
        <div class="form-group">
          <label for="new-password">新密码</label>
          <input
            v-model="password.new"
            type="password"
            id="new-password"
            required
          />
        </div>
        <div class="form-group">
          <label for="confirm-password">确认新密码</label>
          <input
            v-model="password.confirm"
            type="password"
            id="confirm-password"
            required
          />
        </div>
        <button type="submit" class="submit-button">修改密码</button>
      </form>
    </div>

    <!-- 绑定第三方账号
    <div class="settings-section">
      <h2>绑定第三方账号</h2>
      <div class="third-party-accounts">
        <div v-for="account in thirdPartyAccounts" :key="account.id" class="account-item">
          <i :class="getAccountIcon(account.type)"></i>
          <span>{{ account.name }}</span>
          <button
            v-if="account.linked"
            @click="unlinkAccount(account.type)"
            class="unlink-button"
          >
            解绑
          </button>
          <button v-else @click="linkAccount(account.type)" class="link-button">
            绑定
          </button>
        </div>
      </div>
    </div> -->

    <!-- 隐私设置 -->
    <!-- <div class="settings-section">
      <h2>隐私设置</h2>
      <div class="privacy-settings">
        <div class="privacy-item">
          <label>
            <input
              v-model="privacySettings.showGameHistory"
              type="checkbox"
            />
            公开我的游戏历史
          </label>
        </div>
        <div class="privacy-item">
          <label>
            <input
              v-model="privacySettings.showFriendList"
              type="checkbox"
            />
            公开我的好友列表
          </label>
        </div>
        <button @click="savePrivacySettings" class="save-button">保存设置</button>
      </div>
    </div> -->

    <!-- 双重验证 -->
    <!-- <div class="settings-section">
      <h2>双重验证</h2>
      <div class="two-factor-auth">
        <p>双重验证可以增加账户的安全性。</p>
        <button
          v-if="twoFactorEnabled"
          @click="disableTwoFactorAuth"
          class="disable-button"
        >
          禁用双重验证
        </button>
        <button v-else @click="enableTwoFactorAuth" class="enable-button">
          启用双重验证
        </button>
      </div>
    </div> -->
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      password: {
        current: '',
        new: '',
        confirm: ''
      },
      thirdPartyAccounts: [
        { id: 1, type: 'steam', name: 'Steam', linked: true },
        { id: 2, type: 'google', name: 'Google', linked: false }
      ],
      privacySettings: {
        showGameHistory: true,
        showFriendList: false
      },
      twoFactorEnabled: false
    }
  },
  computed: {
    ...mapState(['user']) // 将 Vuex 中的 user 映射到组件的计算属性
  },
  methods: {
    async changePassword () {
      if (this.password.new !== this.password.confirm) {
        alert('新密码与确认密码不一致！')
        return
      }

      try {
        const userId = this.user.id
        const response = await axios.post(`http://127.0.0.1:5000/api/change-password/${userId}`, {
          currentPassword: this.password.current,
          newPassword: this.password.new
        })
        if (response.data.success) {
          alert('密码修改成功！')
          this.password = { current: '', new: '', confirm: '' }
          this.handleLogout()
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        alert('修改密码失败，请重试。')
      }
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
    },
    async linkAccount (accountType) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/link-account', {
          accountType
        })
        if (response.data.success) {
          const account = this.thirdPartyAccounts.find((acc) => acc.type === accountType)
          if (account) {
            account.linked = true
          }
          alert('绑定成功！')
        }
      } catch (error) {
        console.error('绑定失败:', error)
        alert('绑定失败，请重试。')
      }
    },
    async unlinkAccount (accountType) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/unlink-account', {
          accountType
        })
        if (response.data.success) {
          const account = this.thirdPartyAccounts.find((acc) => acc.type === accountType)
          if (account) {
            account.linked = false
          }
          alert('解绑成功！')
        }
      } catch (error) {
        console.error('解绑失败:', error)
        alert('解绑失败，请重试。')
      }
    },
    async savePrivacySettings () {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/privacy-settings', {
          settings: this.privacySettings
        })
        if (response.data.success) {
          alert('隐私设置已保存！')
        }
      } catch (error) {
        console.error('保存隐私设置失败:', error)
        alert('保存隐私设置失败，请重试。')
      }
    },
    async enableTwoFactorAuth () {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/enable-two-factor')
        if (response.data.success) {
          this.twoFactorEnabled = true
          alert('双重验证已启用！')
        }
      } catch (error) {
        console.error('启用双重验证失败:', error)
        alert('启用双重验证失败，请重试。')
      }
    },
    async disableTwoFactorAuth () {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/disable-two-factor')
        if (response.data.success) {
          this.twoFactorEnabled = false
          alert('双重验证已禁用！')
        }
      } catch (error) {
        console.error('禁用双重验证失败:', error)
        alert('禁用双重验证失败，请重试。')
      }
    },
    getAccountIcon (accountType) {
      switch (accountType) {
        case 'steam':
          return 'fab fa-steam'
        case 'google':
          return 'fab fa-google'
        default:
          return 'fas fa-user'
      }
    }
  }
}
</script>

<style scoped>
.settings-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
}

h2 {
  margin-bottom: 15px;
  font-size: 22px;
  color: #333;
}

.settings-section {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-button,
.save-button,
.enable-button,
.disable-button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover,
.save-button:hover,
.enable-button:hover {
  background-color: #3aa876;
}

.disable-button {
  background-color: #ff4d4f;
}

.disable-button:hover {
  background-color: #ff7875;
}

.third-party-accounts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.account-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.account-item i {
  font-size: 24px;
  color: #666;
}

.link-button,
.unlink-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.link-button {
  background-color: #42b983;
  color: white;
}

.unlink-button {
  background-color: #ff4d4f;
  color: white;
}

.link-button:hover {
  background-color: #3aa876;
}

.unlink-button:hover {
  background-color: #ff7875;
}

.privacy-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.privacy-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.privacy-item label {
  font-size: 14px;
  color: #666;
}

.two-factor-auth {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.two-factor-auth p {
  margin: 0;
  font-size: 14px;
  color: #666;
}
</style>