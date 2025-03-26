<template>
  <div class="game-recommendations">
    <h2>为你推荐</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <div v-if="games.length > 0" class="game-list">
        <div v-for="game in filteredGames" :key="game.id" class="game-item">
          <img :src="game.image_url" alt="游戏封面" class="game-thumbnail" @click="viewGameDetail(game.game_id)" />
          <div class="game-info">
            <h3 @click="viewGameDetail(game.id)">{{ game.name }}</h3>
            <p class="description">{{ game.short_description }}</p>
            <div class="game-rating">
              <span>评分: {{ game.rating }}</span>
            </div>
            <button @click.stop="downloadGame(game.store_url)">立即下载</button>
          </div>
        </div>
      </div>
      <div v-else class="no-games">暂无推荐游戏。</div>
    </div>
     <!-- 分页 -->
  <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span>第 {{ currentPage }} 页</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      games: [], // 推荐游戏列表
      loading: true, // 加载状态
      currentPage: 1, // 当前页码
      pageSize: 6// 每页显示的游戏数量
    }
  },
  computed: {
    ...mapState(['user']), // 将 Vuex 中的 user 映射到组件的计算属性
    // 过滤和排序后的游戏列表
    filteredGames () {
      let games = this.games

      // 搜索过滤
      if (this.searchQuery) {
        games = games.filter((game) =>
          game.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }

      // 排序
      if (this.sortBy === 'date') {
        games.sort((a, b) => new Date(b.collectionDate) - new Date(a.collectionDate))
      } else if (this.sortBy === 'rating') {
        games.sort((a, b) => b.rating - a.rating)
      }

      // 分页
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return games.slice(start, end)
    },
    // 总页数
    totalPages () {
      return Math.ceil(this.games.length / this.pageSize)
    }
  },
  mounted () {
    this.fetchRecommendedGames()
  },
  methods: {
    async fetchRecommendedGames () {
      try {
        const steamId = this.user.steam_id
        const response = await axios.get(`http://127.0.0.1:5000/recommend/${steamId}`)
        this.games = response.data.recommendations
      } catch (error) {
        console.error('获取推荐游戏失败:', error)
      } finally {
        this.loading = false
      }
    },
    viewGameDetail (gameId) {
      const routeData = this.$router.resolve({ name: 'GameDetail', params: { id: gameId } })
      window.open(routeData.href, '_blank') // 在新标签页打开
    },
    // 打开游戏的下载链接
    downloadGame (link) {
      window.open(link, '_blank') // 打开游戏下载链接（在新标签页中）
    },
    async addToWishlist (gameId) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/wishlist', { gameId })
        if (response.data.success) {
          // 更新游戏状态
          const game = this.games.find((g) => g.id === gameId)
          if (game) {
            game.inWishlist = true
          }
          alert('已加入愿望单！')
        }
      } catch (error) {
        console.error('加入愿望单失败:', error)
        alert('加入愿望单失败，请重试。')
      }
    },
    prevPage () {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage () {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    }
  }
}
</script>

<style scoped>
.game-recommendations {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
}

.loading,
.no-games {
  text-align: center;
  font-size: 16px;
  color: #666;
}

.game-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.game-item {
  width: calc(33.333% - 20px);
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.game-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.game-thumbnail {
  width: 100%;
  height: 180px;
  object-fit: cover;
  cursor: pointer;
}

.game-info {
  padding: 15px;
}

.game-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
  cursor: pointer;
}

/* 游戏描述 */
.game-info .description {
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
/* 鼠标悬停时显示描述和下载按钮 */
.game-list:hover .description {
  opacity: 1; /* 显示描述 */
  height: auto; /* 高度自适应 */
  -webkit-line-clamp: 2; /* unset取消行数限制 */
  line-clamp: 1; /* 取消行数限制 */
}
.game-info /* 查看详情按钮 */
button {
  width: 100%;
  padding: 10px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  /* opacity: 0; /* 默认隐藏 */
  /* transform: translateY(20px); /* 默认向下移动 */
  /* transition: all 0.3s ease; */
}
.game-rating {
  margin-bottom: 10px;
  font-size: 14px;
  color: #ff9800;
}

.wishlist-button {
  width: 100%;
  padding: 8px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.wishlist-button:hover {
  background-color: #3aa876;
}

.wishlist-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
/* 响应式设计 */
@media (max-width: 768px) {
  .game-item {
    width: calc(50% - 20px);
  }
}

@media (max-width: 480px) {
  .game-item {
    width: 100%;
  }
}
</style>