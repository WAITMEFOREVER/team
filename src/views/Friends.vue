<template>
  <div class="friends-page">
    <h1>好友与社交</h1>

    <!-- 好友列表 -->
    <div class="friends-list">
      <h2>好友列表</h2>

      <!-- 加载中 -->
      <div v-if="loading">加载中...</div>

      <!-- 好友列表 -->
      <div v-else-if="friends.length > 0">
        <div v-for="friend in friends" :key="friend.steamid" class="friend-item">
          <img :src="friend.avatar" :alt="friend.nickname" class="friend-avatar" />
          <div class="friend-info">
            <p>{{ friend.nickname }}</p>
            <!-- <a :href="friend.profile_url" target="_blank">查看资料</a> -->
          </div>
        </div>
      </div>

      <!-- 无好友 -->
      <div v-else>
        <p>暂无好友</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      friends: [], // 好友列表
      loading: true // 加载状态
    }
  },
  computed: {
    ...mapState(['user']) // 从 Vuex 获取用户信息
  },
  mounted () {
    this.fetchSteamFriends()
  },
  methods: {
    async fetchSteamFriends () {
      const userId = this.user.steam_id // 获取 Steam ID
      this.loading = true // 开始加载
      axios.get(`http://127.0.0.1:5000/steam/friends/${userId}`)
        .then(response => {
          if (response.data.success) {
            this.friends = response.data.friends // 存储好友数据
          } else {
            console.error('获取好友列表失败:', response.data.message)
          }
        })
        .catch(error => {
          console.error('获取好友列表失败:', error)
        })
        .finally(() => {
          this.loading = false // 结束加载
        })
    }
  }
}
</script>

<style scoped>
.friends-page {
  padding: 20px;
  max-width: 1200px;
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

.friends-list {
  max-height: 400px; /* 固定高度 */
  overflow-y: auto; /* 允许垂直滚动 */
  scrollbar-width: none; /* 隐藏 Firefox 滚动条 */
}

.friends-list::-webkit-scrollbar {
  display: none; /* 隐藏 Chrome/Safari 滚动条 */
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.friend-avatar {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 50%;
}

.friend-info p {
  margin: 0;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
