<template>
  <div class="game-recommendations">
    <h2>为你推荐</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <div v-if="games.length > 0" class="game-list">
        <div v-for="game in games" :key="game.id" class="game-item">
          <img :src="game.thumbnail" alt="游戏封面" class="game-thumbnail" @click="viewGameDetail(game.id)" />
          <div class="game-info">
            <h3 @click="viewGameDetail(game.id)">{{ game.name }}</h3>
            <p>{{ game.description }}</p>
            <div class="game-rating">
              <span>评分: {{ game.rating }}/10</span>
            </div>
            <button @click="addToWishlist(game.id)" class="wishlist-button">
              {{ game.inWishlist ? '已加入愿望单' : '加入愿望单' }}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="no-games">暂无推荐游戏。</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      games: [], // 推荐游戏列表
      loading: true // 加载状态
    }
  },
  mounted () {
    this.fetchRecommendedGames()
  },
  methods: {
    async fetchRecommendedGames () {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/recommended-games')
        this.games = response.data.games
      } catch (error) {
        console.error('获取推荐游戏失败:', error)
      } finally {
        this.loading = false
      }
    },
    viewGameDetail (gameId) {
      // 跳转到游戏详情页
      this.$router.push(`/game/${gameId}`)
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

.game-info p {
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
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