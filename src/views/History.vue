<template>
  <div class="game-history-page">
    <h2>游戏历史与动态</h2>

    <!-- 游戏历史 -->
    <div v-if="steamHistory.length > 0">
      <div v-for="item in steamHistory" :key="item.game.appid" class="game-item">
        <img :src="item.game.img_logo_url" :alt="item.game.name" class="game-image" />
        <div class="game-info">
          <p>{{ item.game.name }}</p>
          <p>总游玩时间: {{ Math.floor(item.game.playtime_forever / 60) }} 小时</p>
          <p>过去两周游玩时间: {{ Math.floor(item.game.playtime_2weeks / 60) }} 小时</p>

          <h4>成就</h4>
          <ul v-if="item.achievements">
            <li v-for="achievement in item.achievements" :key="achievement.name">
              {{ achievement.name }} - {{ achievement.achieved ? '已解锁' : '未解锁' }}
            </li>
          </ul>

          <h4>动态</h4>
          <ul v-if="item.news">
            <li v-for="news in item.news" :key="news.title">
              <a :href="news.url" target="_blank">{{ news.title }}</a>
              <p>{{ news.contents }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <p>无游戏历史记录</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      gameHistory: [], // 游戏历史列表
      steamHistory: [] // 游戏历史列表
    }
  },
  computed: {
    ...mapState(['user']) // 将 Vuex 中的 user 映射到组件的计算属性
  },
  mounted () {
    this.fetchSteamHistory()
  },
  methods: {
    async fetchSteamHistory () {
      const userId = this.user.id // 从用户数据中获取用户 ID
      axios.get(`http://127.0.0.1:5000/steam/history/${userId}`)
        .then(response => {
          if (response.data.success) {
            this.steamHistory = response.data.history// 保存游戏历史与动态
          } else {
            console.error('获取游戏历史失败:', response.data.message)
          }
        })
        .catch(error => {
          console.error('获取游戏历史失败:', error)
        })
    }
  }
}
</script>

<style scoped>
h2 {
  margin-bottom: 15px;
  font-size: 22px;
  color: #333;
}

.game-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.game-image {
  width: 200px;
  height: 100px;
  margin-right: 10px;
}

.game-info {
  flex: 1;
}
</style>