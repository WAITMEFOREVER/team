<template>
  <div class="friends-page">
    <h1>好友与社交</h1>

    <!-- 好友列表 -->
    <div class="friends-list">
      <h2>好友列表</h2>
      <div v-if="friends.length > 0">
      <div v-for="friend in friends" :key="friend.steamid" class="friend-item">
        <img :src="friend.avatar" :alt="friend.name" class="friend-avatar" />
        <div class="friend-info">
          <p>{{ friend.name }}</p>
          <a :href="friend.profile_url" target="_blank">查看资料</a>
        </div>
      </div>
    </div>
    <div v-else>
      <p>暂无好友</p>
    </div>

    <h3>好友动态</h3>
    <div v-if="friendActivity.length > 0">
      <div v-for="activity in friendActivity" :key="activity.friend_id + activity.game.appid" class="activity-item">
        <p>{{ activity.friend_id }} 最近玩过 {{ activity.game.name }}</p>
        <p>动态: {{ activity.news.title }}</p>
        <a :href="activity.news.url" target="_blank">查看详情</a>
      </div>
    </div>
    <div v-else>
      <p>暂无好友动态</p>
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
      friendActivity: [] // 好友动态列表
    }
  },
  computed: {
    ...mapState(['user']) // 将 Vuex 中的 user 映射到组件的计算属性
  },
  mounted () {
    this.fetchSteamFriends()
  },
  methods: {
    async fetchSteamFriends () {
      const userId = this.user.id // 从用户数据中获取用户 ID
      axios.get(`http://127.0.0.1:5000/steam/friends/${userId}`)
        .then(response => {
          if (response.data.success) {
            this.friends = response.data.friends // 保存好友列表
            this.friendActivity = response.data.activity // 保存好友动态
          } else {
            console.error('获取好友列表失败:', response.data.message)
          }
        })
        .catch(error => {
          console.error('获取好友列表失败:', error)
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

.friend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.friend-avatar {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.activity-item {
  margin-bottom: 20px;
}
</style>