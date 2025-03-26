<template>
  <div class="profile-container">
    <!-- 左侧导航栏 -->
    <div class="left-section">
      <div class="profile-header">
        <div class="user-info">
          <img :src="avatar || defaultAvatar" alt="头像" class="avatar" />
          <div class="user-details">
            <h2>{{ userN }}</h2>
            <button class="edit-profile-button">编辑资料</button>
          </div>
        </div>
      </div>
      <div class="profile-nav">
        <ul>
          <li><router-link to="/profile">个人主页</router-link></li>
          <li><router-link to="/profile/recommendations">游戏推荐</router-link></li>
          <li><router-link to="/profile/collections">收藏</router-link></li>
          <!-- <li><router-link to="/profile/wishlist">愿望单</router-link></li> -->
          <!-- <li><router-link to="/profile/history">游戏历史与动态</router-link></li> -->
          <li><router-link to="/profile/friends">好友与社交</router-link></li>
          <li><router-link to="/profile/settings">设置与安全</router-link></li>
        </ul>
      </div>
      <button @click="handleLogout" class="logout-button">退出登录</button>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content-section">
      <router-view></router-view> <!-- 子路由出口 -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      videos: [], // 模拟视频数据
      avatar: [], // 用户头像
      userN: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    user () {
      return this.userInfo || {}
    }
  },
  created () {
    this.fetchUserAvatar()
    this.userN = this.user.username
    console.log(this.userInfo)
  },
  methods: {
    ...mapActions(['logout', 'updateAvatar']),
    handleLogout () {
      // 清除本地存储的用户信息和 token
      localStorage.removeItem('user')
      localStorage.removeItem('token')

      // 清除 Vuex 中的用户信息和 token
      this.$store.commit('setUser', null)
      this.$store.commit('setToken', null)
      // 跳转到首页并刷新页面
      this.$router.push('/')
      window.location.reload()
    },
    async fetchUserAvatar () {
      console.log(this.userInfo.id)
      const response = await axios.get(`http://127.0.0.1:5000/get_user_avatar?user_id=${this.userInfo.id}`)
      this.avatar = response.data.avatar
    }
  }
}
</script>

<style scoped>
.profile-container {
  display: flex;
  margin: 30px auto;
  max-width: 1200px;
  width: 90%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.left-section {
  width: 250px;
  background-color: #f8f9fa;
  padding: 20px;
  border-right: 1px solid #e0e0e0;
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  border: 3px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-details h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.user-details p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.edit-profile-button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.edit-profile-button:hover {
  background-color: #3aa876;
}

.profile-nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.profile-nav ul li {
  margin-bottom: 10px;
}

.profile-nav ul li a {
  text-decoration: none;
  color: #333;
  display: block;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 14px;
}

.profile-nav ul li a:hover {
  background-color: #e0e0e0;
  color: #42b983;
}

.profile-nav ul li a.router-link-exact-active {
  background-color: #42b983;
  color: white;
}

.logout-button {
  width: 100%;
  padding: 10px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #ff7875;
}

.content-section {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
    width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .left-section {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>