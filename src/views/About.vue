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
        <el-button type="text" @click="filterGames('全部')">全部</el-button>
        <el-button type="text" @click="filterGames('动作')">动作</el-button>
        <el-button type="text" @click="filterGames('冒险')">冒险</el-button>
        <el-button type="text" @click="filterGames('射击')">射击</el-button>
        <el-button type="text" @click="filterGames('角色扮演')">角色扮演</el-button>
        <el-button type="text" @click="filterGames('策略')">策略</el-button>
        <el-button type="text" @click="filterGames('体育')">体育</el-button>
        <el-button type="text" @click="shuffleGames">换一换</el-button>
      </div>

      <!-- 游戏展示 -->
      <div class="card-container">
          <div class="card" v-for="(game, index) in filteredGames" :key="index">
            <img :src="game.image" alt="Game Cover" class="card-image">
            <div class="card-content">
              <h3 class="game-title">{{ game.title }}</h3>
              <p class="game-rating">评分: {{ game.rating }}</p>
              <p class="game-description">{{ game.description }}</p>
              <button class="download">立即下载</button>
            </div>
          </div>
        </div>
    </div>

    <!-- 为你推荐 -->
    <div class="recommendation">
      <h2>为你推荐</h2>
      <div class="filter-buttons">
        <el-button type="text" @click="filterRecommendations('全部')">全部</el-button>
        <el-button type="text" @click="filterRecommendations('科幻')">科幻</el-button>
        <el-button type="text" @click="filterRecommendations('都市生活')">都市生活</el-button>
        <el-button type="text" @click="filterRecommendations('武侠江湖')">武侠江湖</el-button>
        <el-button type="text" @click="filterRecommendations('真实事件改编')">真实事件改编</el-button>
        <el-button type="text" @click="filterRecommendations('原创动画')">原创动画</el-button>
        <el-button type="text" @click="filterRecommendations('奇幻冒险')">奇幻冒险</el-button>
        <el-button type="text" @click="filterRecommendations('东方仙侠')">东方仙侠</el-button>
        <el-button type="text" @click="filterRecommendations('古装爱情')">古装爱情</el-button>
        <el-button type="text" @click="filterRecommendations('更多')">更多</el-button>
      </div>
      <!-- 推荐展示 -->
      <div class="card-container">
          <div class="card" v-for="(item, index) in filteredRecommendations" :key="index">
            <img :src="item.image" alt="recommendation" class="card-image">
            <div class="card-content">
              <h3 class="game-title">{{ item.title }}</h3>
              <p class="game-rating">评分: {{ item.rating }}</p>
              <p class="game-description">{{ item.description }}</p>
              <button class="download">立即下载</button>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentGameIndex: 0, // 当前播放的游戏索引
      isMuted: true, // 静音状态
      games: [
        {
          id: 1,
          name: '忍者必须死3',
          video: require('@/assets/game1.mp4'),
          thumbnail:
            'https://img1.baidu.com/it/u=1825588794,1142855539&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500/200x200?text=Game+1',
          downloadLink: 'https://example.com/download/game1' // 游戏的下载链接
        },
        {
          id: 2,
          name: '高爆射击战',
          video: require('@/assets/game2.mp4'),
          thumbnail:
            'https://img2.baidu.com/it/u=115549207,88011968&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500/200x200?text=Game+2',
          downloadLink: 'https://example.com/download/game2' // 游戏的下载链接
        },
        {
          id: 3,
          name: '冒险传奇',
          video: require('@/assets/game3.mp4'),
          thumbnail:
            'https://img1.baidu.com/it/u=2195067030,2402272843&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500/200x200?text=Game+3',
          downloadLink: 'https://example.com/download/game3' // 游戏的下载链接
        }
      ],
      Games: [
        { title: '游戏1', image: 'https://via.placeholder.com/150', rating: 8.9, category: '动作', description: '游戏1描述....................................................................' },
        { title: '游戏2', image: 'https://via.placeholder.com/150', rating: 9.4, category: '动作' },
        { title: '游戏3', image: 'https://via.placeholder.com/150', rating: 8.7, category: '动作' },
        { title: '游戏4', image: 'https://via.placeholder.com/150', rating: 9.1, category: '动作' },
        { title: '游戏5', image: 'https://via.placeholder.com/150', rating: 8.8, category: '冒险' },
        { title: '游戏6', image: 'https://via.placeholder.com/150', rating: 8.5, category: '动作' },
        { title: '游戏7', image: 'https://via.placeholder.com/150', rating: 8.6, category: '冒险' },
        { title: '游戏8', image: 'https://via.placeholder.com/150', rating: 8.9, category: '动作' }
      ],
      recommendations: [
        { title: '科幻', image: 'https://via.placeholder.com/150', rating: 8.9, category: '科幻' },
        { title: '都市生活', image: 'https://via.placeholder.com/150', rating: 8.7, category: '都市生活' },
        { title: '武侠江湖', image: 'https://via.placeholder.com/150', rating: 8.8, category: '武侠江湖' },
        { title: '真实事件改编', image: 'https://via.placeholder.com/150', rating: 8.9, category: '真实事件改编' },
        { title: '原创动画', image: 'https://via.placeholder.com/150', rating: 8.6, category: '原创动画' },
        { title: '奇幻冒险', image: 'https://via.placeholder.com/150', rating: 8.7, category: '奇幻冒险' },
        { title: '东方仙侠', image: 'https://via.placeholder.com/150', rating: 8.8, category: '东方仙侠' },
        { title: '古装爱情', image: 'https://via.placeholder.com/150', rating: 8.9, category: '古装爱情' }
      ],
      filteredGames: [],
      filteredRecommendations: []
    }
  },
  created () {
    this.filteredGames = this.Games
    this.filteredRecommendations = this.recommendations
  },
  computed: {
    // 当前播放的视频对象
    currentGame () {
      return this.games[this.currentGameIndex]
    }
  },
  methods: {
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
    // 打开游戏的下载链接
    downloadGame (link) {
      window.open(link, '_blank') // 打开游戏下载链接（在新标签页中）
    },
    // 过滤热播
    filterGames (category) {
      if (category === '全部') {
        this.filteredGames = this.Games
      } else {
        this.filteredGames = this.Games.filter(item => item.category === category)
      }
    },
    filterRecommendations (category) {
      if (category === '全部') {
        this.filteredRecommendations = this.recommendations
      } else {
        this.filteredRecommendations = this.recommendations.filter(item => item.category === category)
      }
    }
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

/* 游戏标题 */
.game-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
  color: #fff;
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