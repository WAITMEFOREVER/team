<template>
  <div class="collection-page">
    <h2>我的收藏</h2>

    <!-- 搜索和排序 -->
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索游戏名称"
        class="search-input"
      />
      <select v-model="sortBy" class="sort-select">
        <option value="date">按收藏时间</option>
        <option value="rating">按评分</option>
      </select>
    </div>

    <!-- 收藏列表 -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <div v-if="filteredGames.length > 0" class="game-list">
        <div v-for="game in filteredGames" :key="game.id" class="game-item">
          <img :src="game.img_logo_url" alt="游戏封面" class="game-thumbnail" @click="viewGameDetail(game.id)" />
          <div class="game-info">
            <h3 @click="viewGameDetail(game.id)">{{ game.name }}</h3>
            <div class="game-meta">
              <span>是否付费: {{ game.is_free }}/10</span>
              <span>游戏时长: {{ game.playtime_forever }}</span>
            </div>
            <button @click="removeFromCollection(game.id)" class="remove-button">
              取消收藏
            </button>
          </div>
        </div>
      </div>
      <div v-else class="no-games">暂无收藏内容。</div>
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
      games: [], // 收藏的游戏列表
      loading: true, // 加载状态
      searchQuery: '', // 搜索关键词
      sortBy: 'date', // 排序方式
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
    this.fetchCollection()
  },
  methods: {
    async fetchCollection () {
      try {
        const userId = this.user.id
        const response = await axios.get(`http://127.0.0.1:5000/steam/collection/${userId}`)
        this.games = response.data.games
        console.log(this.games)
      } catch (error) {
        console.error('获取收藏列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    viewGameDetail (gameId) {
      // 跳转到游戏详情页
      this.$router.push(`/game/${gameId}`)
    },
    async removeFromCollection (gameId) {
      try {
        const response = await axios.delete(`http://127.0.0.1:5000/api/collection/${gameId}`)
        if (response.data.success) {
          // 从本地列表中移除游戏
          this.games = this.games.filter((game) => game.id !== gameId)
          alert('已取消收藏！')
        }
      } catch (error) {
        console.error('取消收藏失败:', error)
        alert('取消收藏失败，请重试。')
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
.collection-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.sort-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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

.game-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #888;
}

.remove-button {
  width: 100%;
  padding: 8px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #ff7875;
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