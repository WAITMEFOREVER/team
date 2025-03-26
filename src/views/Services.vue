<template>
  <div class="services">
    <!-- 用户数据展示 -->
    <div class="user-data">
      <h2>我的游戏数据</h2>
      <div class="data-section">
        <div class="data-card game-library">
          <h3>游戏库</h3>
          <ul>
            <li v-for="game in userGames" :key="game.id">{{ game.game_name }}</li>
          </ul>
        </div>

        <div class="data-card">
          <h3>游戏时长</h3>
          <div ref="playtimeChart" style="width: 100%; height: 300px;"></div>
        </div>

        <div class="data-card">
          <h3>游戏成就</h3>
          <p>已解锁成就：{{ unlockedAchievements }} / {{ totalAchievements }}</p>
        </div>

        <!-- 游戏类型占比 -->
        <div class="data-card">
          <h3>游戏类型占比</h3>
          <div class="chart-container">
            <div ref="gameTagsChart" style="width: 100%; height: 400px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏排行榜 -->
    <div class="game-rank">
      <h2>游戏热销榜</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>图片</th>
              <th>游戏名称</th>
              <th>发布日期</th>
              <th>价格</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(game, index) in topGames" :key="game.id">
              <td>{{ index + 1 }}</td>
              <td><img :src="game.image_url" alt=""></td>
              <td><a :href="game.link" target="_blank">{{ game.title }}</a></td>
              <td>{{ game.release_date }}</td>
              <td>{{ game.price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 好友正在玩的游戏 -->
    <el-card>
      <h2>好友正在玩的游戏</h2>
      <el-table :data="friendGamesList" border style="width: 100%">
        <el-table-column prop="friend" label="好友 Steam ID" width="200"></el-table-column>
        <el-table-column prop="game" label="游戏"></el-table-column>
        <el-table-column prop="hours" label="游戏时长（小时）" width="180"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import * as echarts from 'echarts'
import { mapState } from 'vuex'

export default {
  name: 'GameRatingChart',
  data () {
    return {
      userGames: [],
      playtimeData: [],
      unlockedAchievements: 0,
      totalAchievements: 0,
      topGames: [],
      gameTagsData: [],
      friendGamesList: [],
      playtimeChart: null, // ECharts 实例
      gameTagsChart: null // ECharts 实例
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async mounted () {
    try {
      await this.fetchUserData()
      await this.fetchGameTags()
      await this.fetchTopGames()
      await this.fetchFriendGames()
      this.initCharts() // 初始化图表
      window.addEventListener('resize', this.resizeCharts) // 绑定 resize 事件
    } catch (error) {
      console.error('Failed to initialize component:', error)
    }
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.resizeCharts) // 解绑 resize 事件
    if (this.playtimeChart) this.playtimeChart.dispose() // 销毁图表实例
    if (this.gameTagsChart) this.gameTagsChart.dispose() // 销毁图表实例
  },
  methods: {
    async fetchUserData () {
      try {
        const steamId = this.user?.steam_id // 确保 steamId 存在
        console.log('steamId', steamId)
        const token = localStorage.getItem('token') // 获取 JWT Token
        console.log('token', token)

        if (!steamId) {
          console.error('steam_id 为空')
          return
        }

        if (!token) {
          console.error('没有找到 Token，请先登录')
          return
        }
        const response = await axios.get('http://127.0.0.1:5000/user-data', {
          params: { steam_id: steamId }, // 确保参数格式正确
          headers: { Authorization: `Bearer ${token}` }
        })

        const data = response.data
        this.userGames = data.userGames
        this.playtimeData = data.playtimeData
        this.unlockedAchievements = data.achievements.unlocked
        this.totalAchievements = data.achievements.total
      } catch (error) {
        // console.log('token', this.token)
        console.error('获取用户数据失败:', error.response?.data || error)
      }
    },
    async fetchGameTags () {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/game-tags/${this.user.steam_id}`)
        this.gameTagsData = response.data
      } catch (error) {
        console.error('获取游戏标签数据失败:', error)
      }
    },
    async fetchTopGames () {
      try {
        const response = await axios.get('http://127.0.0.1:5000/topgames')
        this.topGames = response.data
      } catch (error) {
        console.error('获取游戏排行榜失败:', error)
      }
    },
    initCharts () {
      this.initPlaytimeChart()
      this.initGameTagsChart()
    },
    initPlaytimeChart () {
      if (!this.$refs.playtimeChart || this.playtimeData.length === 0) return
      this.playtimeChart = echarts.init(this.$refs.playtimeChart)
      const option = {
        title: { text: '游戏时长（小时）', left: 'center' },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: this.playtimeData.map(game => game.name)
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '游戏时长',
            type: 'bar',
            data: this.playtimeData.map(game => game.playtime),
            itemStyle: { color: '#5470c6' }
          }
        ]
      }
      this.playtimeChart.setOption(option)
    },
    initGameTagsChart () {
      if (!this.$refs.gameTagsChart || this.gameTagsData.length === 0) return
      this.gameTagsChart = echarts.init(this.$refs.gameTagsChart)
      const option = {
        title: { text: '游戏类型占比', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [
          {
            name: '游戏类型',
            type: 'pie',
            radius: '60%',
            data: this.gameTagsData.map(tag => ({
              name: tag.tag,
              value: tag.count
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.gameTagsChart.setOption(option)
    },
    resizeCharts () {
      if (this.playtimeChart) this.playtimeChart.resize()
      if (this.gameTagsChart) this.gameTagsChart.resize()
    },
    // 获取好友游戏数据
    async fetchFriendGames () {
      try {
        const steamId = this.user.steam_id
        console.log('获取好友游戏数据', steamId)
        const response = await axios.get(`http://127.0.0.1:5000/friend_games/${steamId}`)
        const data = response.data

        const gamesList = []
        for (const friend in data) {
          data[friend].forEach((game) => {
            gamesList.push({
              friend,
              game: game.name,
              hours: game.playtime_hours
            })
          })
        }
        this.friendGamesList = gamesList // 修复响应式问题
      } catch (error) {
        console.error('获取好友游戏数据失败', error)
      }
    }
  }
}
</script>

<style scoped>
.services {
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), url('../assets/wallhaven-rrl1kj.jpg');
  background-size: cover;
  background-position: center;
}

.user-data {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
}

.data-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 20px;
}

.data-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
}

.game-library ul {
  max-height: 230px;
  overflow-y: auto;
  padding: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.game-rank {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

h2 {
  color: white;
  margin-bottom: 15px;
}

.table-container {
  max-height: 420px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background-color: #626262;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

th {
  background-color: rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 1;
}

td img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.table-container::-webkit-scrollbar {
  width: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  color: white;
  margin: 5px 0;
}

.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
</style>