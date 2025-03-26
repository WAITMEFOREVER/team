<template>
  <div class="game-recommendation-page">
    <!-- 大图横幅区 -->
    <div class="banner">
      <div class="video-player">
        <video
          ref="videoPlayer"
          :src="currentGame.video"
          :muted="isMuted"
          autoplay
          class="game-video"
          @ended="playNextVideo"
        />
        <!-- 立即下载按钮 -->
        <el-button
          v-if="currentGame.downloadLink"
          @click="downloadGame(currentGame.downloadLink)"
          class="download-button"
        >
          立即下载
        </el-button>
        <div class="controls">
          <!-- 静音控制按钮 -->
          <el-button @click="toggleMute" class="mute-button">
            {{ isMuted ? '取消静音' : '静音' }}
          </el-button>
        </div>
      </div>

      <!-- 右下角小图 -->
      <div class="thumbnail-container">
        <div
          v-for="(game, index) in games"
          :key="game.id"
          class="thumbnail-item"
          :class="{ 'selected': currentGameIndex === index }"
          @click="changeGame(index)"
        >
          <img :src="game.thumbnail" alt="game thumbnail" class="thumbnail-image" />
          <div class="thumbnail-name">
            {{ game.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏推荐部分 -->
    <div class="game-recommendation">
      <h2>游戏推荐</h2>
      <!-- 筛选按钮 -->
      <div class="filter-buttons">
        <el-button type="text" @click="filterGames('all')">全部</el-button>
        <el-button type="text" @click="filterGames('Action')">动作</el-button>
        <el-button type="text" @click="filterGames('RPG')">角色扮演</el-button>
        <el-button type="text" @click="filterGames('Adventure')">冒险</el-button>
        <el-button type="text" @click="filterGames('Simulation')">模拟</el-button>
        <el-button type="text" @click="filterGames('Indie')">独立</el-button>
        <el-button type="text" @click="filterGames('Casual')">休闲</el-button>
        <el-button type="text" @click="shuffleGames">换一换</el-button>
      </div>

      <!-- 游戏展示 -->
      <div class="card-container">
          <div
          class="card"
          v-for="(game, index) in displayedGames" :key="index"
          @click="goToGameDetail(game.game_id)">
            <img :src="game.image_url" alt="Game Cover" class="card-image">
            <div class="card-content">
              <h3 class="game-title">{{ game.title }}</h3>
              <p class="game-rating">价格: {{ game.price }}</p>
              <p class="game-description">类型{{ game.genre }}</p>
              <button class="download" @click.stop="downloadGame (game.link)">立即下载</button>
            </div>
          </div>
        </div>
    </div>

    <!-- 为你推荐 -->
    <div class="recommendation">
      <h2 style="display: inline-block;">为你推荐</h2>
      <el-button style="display: inline-block;margin-left: 76%;" type="text" @click="getRandomGames3">换一换</el-button>
      <div class="card-container">
          <div
          class="card"
          v-for="(item) in personalizedGame" :key="item.id"
          @click="goToGameDetail(item.game_id)">
            <img :src="item.image_url" alt="recommendation" class="card-image">
            <div class="card-content">
              <h3 class="game-title">{{ item.name }}</h3>
              <p class="game-rating">推荐人数: {{ item.total_reviews }}</p>
              <p class="game-description">{{ item.short_description }}</p>
              <button class="download" @click.stop="downloadGame (item.store_url)">立即下载</button>
            </div>
          </div>
        </div>
    </div>
    <!-- 免费推荐 -->
    <div class="recommendation">
      <h2 style="display: inline-block;">免费专区</h2>
      <el-button style="display: inline-block;margin-left: 76%;" type="text" @click="getRandomGames2">换一换</el-button>
      <div class="card-container">
          <div
          class="card"
          v-for="(item) in freeGame" :key="item.id"
          @click="goToGameDetail(item.game_id)">
            <img :src="item.image_url" alt="recommendation" class="card-image">
            <div class="card-content">
              <h3 class="game-title">{{ item.name }}</h3>
              <p class="game-rating">推荐人数: {{ item.total_reviews }}</p>
              <p class="game-description">{{ item.short_description }}</p>
              <button class="download" @click.stop="downloadGame (item.store_url)">立即下载</button>
            </div>
          </div>
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
      currentGameIndex: 0, // 当前播放的游戏索引
      isMuted: true, // 静音状态
      games: [
        {
          id: 1,
          name: 'Counter-Strike 2',
          video: 'http://video.akamai.steamstatic.com/store_trailers/256972298/movie_max_vp9.webm?t=1696005467',
          thumbnail:
            'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1729703045?w=889&h=500/200x200?text=Game+1',
          downloadLink: 'https://store.steampowered.com/app/730' // 游戏的下载链接
        },
        {
          id: 2,
          name: 'Grand Theft Auto V Legacy',
          video: 'http://video.akamai.steamstatic.com/store_trailers/257109786/movie_max_vp9.webm?t=1741119978", "http://video.akamai.steamstatic.com/store_trailers/257083901/movie_max_vp9.webm?t=1734717936',
          thumbnail:
            'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg?t=1741120008?w=889&h=500/200x200?text=Game+2',
          downloadLink: 'https://store.steampowered.com/app/271590' // 游戏的下载链接
        }, {
          id: 3,
          name: 'Terraria',
          video: 'http://video.akamai.steamstatic.com/store_trailers/256785003/movie_max_vp9.webm?t=1589654781", "http://video.akamai.steamstatic.com/store_trailers/2040428/movie_max.webm?t=1447376855',
          thumbnail:
            'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg?t=1731252354?w=800&h=500/200x200?text=Game+3',
          downloadLink: 'https://store.steampowered.com/app/105600' // 游戏的下载链接
        }
      ],
      Games: [], // 所有游戏数据
      filteredGames: [], // 筛选后的游戏数据
      displayedGames: [], // 最终渲染的游戏
      gamesPerRow: 6, // 每行游戏个数（默认）
      personalizedGames: [], // 个性化推荐游戏数据
      personalizedGame: [], // 个性化推荐游戏数据
      freeGames: [], // 免费游戏数据
      freeGame: [], // 免费游戏数据
      filterediltRecommendations: []
    }
  },
  created () {
    this.fetchHotTopGames()
    this.fetchRecommendedGames()
    this.fetchFreeGames()
  },
  computed: {
    ...mapState(['user']), // 从 Vuex Store 中获取用户信息
    // 当前播放的视频对象
    currentGame () {
      return this.games[this.currentGameIndex]
    },
    // 最大显示游戏数
    maxGamesToShow () {
      return this.gamesPerRow * 3// 计算最大显示游戏数（3 行）
    }
  },
  methods: {
    async fetchHotTopGames () {
      try {
        const response = await axios.get('http://127.0.0.1:5000/topgames')
        this.Games = response.data
        this.filteredGames = this.Games
        this.shuffleGames() // 随机排序
        // console.log(this.Games)
      } catch (error) {
        console.error('获取游戏排行榜失败:', error)
        console.error('错误详情:', error.response)
      }
    },
    async fetchRecommendedGames () {
      try {
        const steamId = this.user.steam_id
        const response = await axios.get(`http://127.0.0.1:5000/recommend/${steamId}`)
        this.personalizedGames = response.data.recommendations
        this.getRandomGames3()// 调用随机选择方法
        console.log(this.personalizedGames)
      } catch (error) {
        console.error('获取推荐游戏失败:', error)
        console.error('错误详情:', error.response)
      }
    },
    async fetchFreeGames () {
      try {
        const response = await axios.get('http://127.0.0.1:5000/freegames')
        this.freeGames = response.data.free_games
        this.getRandomGames2()// 调用随机选择方法
        // console.log(this.freeGames)
      } catch (error) {
        console.error('获取推荐游戏失败:', error)
        console.error('错误详情:', error.response)
      }
    },
    // 切换静音状态
    toggleMute () {
      this.isMuted = !this.isMuted
    },
    // 切换视频
    changeGame (index) {
      this.currentGameIndex = index
      this.playVideo() // 切换视频后立即播放
    },
    // 播放下一个视频
    playNextVideo () {
      this.currentGameIndex = (this.currentGameIndex + 1) % this.games.length
      this.playVideo() // 播放下一个视频
    },
    // 播放当前视频
    playVideo () {
      this.$nextTick(() => {
        const videoPlayer = this.$refs.videoPlayer
        if (videoPlayer) {
          videoPlayer.play()
        }
      })
    },
    goToGameDetail (gameId) {
      const routeData = this.$router.resolve({ name: 'GameDetail', params: { id: gameId } })
      window.open(routeData.href, '_blank') // 在新标签页打开
    },
    // 打开游戏的下载链接
    downloadGame (link) {
      window.open(link, '_blank') // 打开游戏下载链接（在新标签页中）
    },
    filterGames (genre) {
      if (genre === 'all') {
        this.filteredGames = this.Games
      } else {
        this.filteredGames = this.Games.filter(item =>
          item.genre && item.genre.toLowerCase().includes(genre.toLowerCase())
        )
      }
      this.shuffleGames() // 每次筛选后随机选择展示
    },
    // 随机选择 3 行的游戏
    shuffleGames () {
      if (this.filteredGames.length <= this.maxGamesToShow) {
        this.displayedGames = [...this.filteredGames] // 如果游戏数量少于可展示的数量，就全部展示
      } else {
        const shuffled = [...this.filteredGames].sort(() => Math.random() - 0.5)
        this.displayedGames = shuffled.slice(0, this.maxGamesToShow)
      }
    },
    getRandomGames3 () {
      if (this.personalizedGames.length <= this.maxGamesToShow) {
        this.personalizedGame = [...this.personalizedGames]
      } else {
        const shuffled = [...this.personalizedGames].sort(() => Math.random() - 0.5)
        this.personalizedGame = shuffled.slice(0, this.maxGamesToShow)
      }
    },
    getRandomGames2 () {
      if (this.freeGames.length <= this.maxGamesToShow) {
        this.freeGame = [...this.freeGames]
      } else {
        const shuffled = [...this.freeGames].sort(() => Math.random() - 0.5)
        this.freeGame = shuffled.slice(0, this.maxGamesToShow)
      }
    },

    // 计算当前屏幕每行能显示多少游戏
    updateGamesPerRow () {
      const cardWidth = 220 // 每张卡片宽度
      const containerWidth = document.querySelector('.card-container')?.clientWidth || window.innerWidth
      this.gamesPerRow = Math.max(1, Math.floor(containerWidth / cardWidth)) // 至少 1 个
      this.shuffleGames() // 更新后重新随机选择
      this.getRandomGames3() // 更新后重新随机选择
      this.getRandomGames2() // 更新后重新随机选择
    },

    filterRecommendations (category) {
      if (category === '全部') {
        this.filteredRecommendations = this.recommendations
      } else {
        this.filteredRecommendations = this.recommendations.filter(item => item.category === category)
      }
    }
  },
  mounted () {
    this.fetchHotTopGames()
    this.fetchRecommendedGames()
    this.fetchFreeGames()
    this.updateGamesPerRow()
    window.addEventListener('resize', this.updateGamesPerRow)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.updateGamesPerRow)
  }
}
</script>

<style scoped>

.banner {
  position: relative;
}

.video-player {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.game-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.mute-button {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.thumbnail-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}
.thumbnail-container .thumbnail-name{
  color: #ddd;
  font-size: 12px;
  text-align: center;
  padding: 5px 0;
  width: 80px; /* 设置元素宽度，以便观察换行效果 */
  padding: 10px;
  overflow-wrap: break-word; /* 允许长单词换行到下一行 */
  word-break: break-word; /* 单词内换行 */
}
.thumbnail-item {
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.thumbnail-item.selected {
  border-color: #67C23A; /* 选中时的边框颜色 */
}

.thumbnail-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.thumbnail-item:hover {
  border-color: #ddd; /* 鼠标悬停时的边框颜色 */
}

.download-button {
  position: absolute;
  bottom: 40px;
  left: 40px;
  background-color: #67C23A;
  color: white;
  font-size: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 10;
}
/*  */
.game-recommendation{
  padding: 20px;
}
.recommendation{
  padding: 20px;
}
/* 卡片容器 */
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
}

/* 单个卡片样式 */
.card {
  width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  background-color: #fff;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

/* 游戏封面图片 */
.card-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

/* 卡片内容 */
.card-content {
  padding: 15px;
  text-align: center;
}

/* 游戏标题 */
.game-title {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.game-rating {
  font-size: 14px;
  color: #777;
  margin-bottom: 15px;
}

/* 游戏评分 */
.game-rating {
  font-size: 14px;
  color: #67c23a;
  margin: 5px 0;
}

/* 游戏描述 */
.game-description {
  font-size: 12px;
  color: #aaa;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* WebKit 私有属性，限制显示两行 */
  -webkit-box-orient: vertical;
  line-clamp: 1; /* 标准属性，未来浏览器支持 */
  box-orient: vertical; /* 标准属性，未来浏览器支持 */
  transition: all 0.3s ease;
  /* opacity: 0; 默认隐藏 */
}

/* 立即下载按钮 */
.download {
  width: 100%;
  padding: 10px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  opacity: 0; /* 默认隐藏 */
  transform: translateY(20px); /* 默认向下移动 */
  transition: all 0.3s ease;
}

/* 鼠标悬停时显示描述和下载按钮 */
.card:hover .game-description {
  opacity: 1; /* 显示描述 */
  height: auto; /* 高度自适应 */
  -webkit-line-clamp: 2; /* unset取消行数限制 */
  line-clamp: 1; /* 取消行数限制 */
}
.card:hover .download {
  opacity: 2; /* 显示按钮 */
  transform: translateY(0); /* 取消移动 */
}

.download:hover {
  background-color: #45a049;
}
/* 筛选按钮容器 */
.filter-buttons {
  display: flex;
  flex-wrap: wrap; /* 按钮换行 */
  gap: 15px; /* 按钮之间的间距 */
  justify-content: center; /* 按钮居中对齐 */
  margin: 20px 0; /* 上下间距 */
}

/* 单个按钮样式 */
.filter-buttons .el-button {
  font-size: 14px;
  color: #333; /* 默认文字颜色 */
  border: 1px solid #ddd; /* 默认边框 */
  border-radius: 5px; /* 按钮圆角 */
  padding: 8px 16px; /* 按钮内边距 */
  transition: background-color 0.3s, color 0.3s; /* 背景色和文字颜色的过渡 */
}

/* 鼠标悬停时的按钮效果 */
.filter-buttons .el-button:hover {
  background-color: #67c23a; /* 鼠标悬停时背景色 */
  color: white; /* 鼠标悬停时文字颜色 */
  border-color: #67c23a; /* 鼠标悬停时边框颜色 */
}

/* 被选中（激活）的按钮样式 */
.filter-buttons .el-button.is-active {
  background-color: #4caf50; /* 激活时的背景色 */
  color: white; /* 激活时的文字颜色 */
  border-color: #4caf50; /* 激活时的边框颜色 */
}
</style>