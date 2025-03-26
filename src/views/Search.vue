<template>
    <div class="search-header">
        <h3>搜索steam游戏</h3>
    </div>
    <div ref="searchContainer">
      <!-- 搜索框 -->
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索游戏..."
          class="search-input"
          @input="fetchSearchResults"
          @focus="showResults = true"
        />
        <button class="search-button" @click="search">搜索</button>
      </div>

      <!-- 搜索结果 -->
      <ul v-if="showResults && searchResults.length > 0" ref="searchResults" class="search-results">
        <li v-for="(result, index) in searchResults" :key="index" @click="selectResult(result)">
          {{ result }}
        </li>
      </ul>

      <!-- 无结果提示 -->
      <div v-else-if="showResults && searchQuery && searchResults.length === 0" class="no-results">
        没有找到相关结果。
      </div>

      <!-- 游戏详情展示 -->
      <div class="game-list">
        <div v-for="(game,index) in games" :key="index" class="game-card" @click="goToGameDetail(game.game_id)">
          <img :src="game.image_url" alt="游戏封面" class="game-image">
          <div class="game-info">
            <h3>{{ game.name }}</h3>
            <p>{{ game.description }}</p>
            <p><strong>评分:</strong> {{ game.rating }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  data () {
    return {
      searchQuery: '',
      searchResults: [],
      showResults: false,
      games: [] // 存储游戏详情
    }
  },
  methods: {
    // 使用 Lodash 防抖
    fetchSearchResults: _.debounce(async function () {
      if (!this.searchQuery.trim()) {
        this.searchResults = []
        return
      }
      try {
        const response = await axios.get('http://127.0.0.1:5000/steam/search', {
          params: { q: this.searchQuery.trim() }
        })
        this.searchResults = response.data
      } catch (error) {
        console.error('搜索请求失败', error)
        this.searchResults = []
      }
    }, 300),

    // 处理点击框外隐藏搜索结果
    handleClickOutside (event) {
      setTimeout(() => {
        if (
          this.$refs.searchContainer &&
              !this.$refs.searchContainer.contains(event.target)
        ) {
          this.showResults = false
        }
      }, 100)
    },

    // 选择搜索结果
    async selectResult (result) {
      this.searchQuery = result
      this.search()
    },

    // 搜索游戏详情
    async search () {
      if (this.searchQuery.trim()) {
        try {
          const response = await axios.get('http://127.0.0.1:5000/steam/searchgame', {
            params: { name: this.searchQuery.trim() }
          })
          this.games = response.data
          console.log('1', this.games)
        } catch (error) {
          console.error('游戏详情获取失败', error)
          this.games = []
        }
        this.showResults = false
      }
    },

    // 获取默认推荐游戏
    async fetchDefaultGames () {
      try {
        const response = await axios.get('http://127.0.0.1:5000/steam/searchrecommendations', {
          params: { count: 30 }
        })
        this.games = response.data
        console.log('2', this.games)
      } catch (error) {
        console.error('推荐游戏获取失败', error)
        this.games = []
      }
    },

    // 解析 URL 参数
    parseUrlQuery () {
      const urlParams = new URLSearchParams(window.location.search)
      const query = urlParams.get('q')
      if (query) {
        this.searchQuery = query
        this.search()

        // 用过 q 之后，删除 URL 中的 q 参数
        urlParams.delete('q')
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`)
      } else {
        this.fetchDefaultGames()
      }
    },
    // 跳转到游戏详情页
    goToGameDetail (gameId) {
      const routeData = this.$router.resolve({ name: 'GameDetail', params: { id: gameId } })
      window.open(routeData.href, '_self')
    }
  },

  watch: {
    searchQuery (newQuery) {
      if (!newQuery.trim()) {
        this.fetchDefaultGames()
        this.searchResults = [] // 清空搜索建议
      } else {
        this.fetchSearchResults()
      }
    }
  },

  mounted () {
    document.addEventListener('click', this.handleClickOutside)
    this.parseUrlQuery() // 解析 URL 参数并触发搜索或加载默认游戏
  },

  beforeUnmount () {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

  <style>
     /* 使用 Flexbox 实现居中 */
     .search-header {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 20vh;
        }
  .search-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
  }

  .search-input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1;
    margin-right: 10px;
    margin-left: 60px;
  }

  .search-button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 60px;
  }

  .search-button:hover {
    background-color: #0056b3;
  }

  .search-results {
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    margin-top: 5px;
    margin-left: 60px;
    margin-right: 60px;
  }

  .search-results ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .search-results li {
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }

  .search-results li:hover {
    background-color: #f5f5f5;
  }

  /* 无结果提示 */
  .no-results {
    padding: 10px;
    color: #666;
    font-style: italic;
  }
  /* 游戏卡片样式 */
  .game-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    padding: 20px;
  }
  .game-card {
    width: 250px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .game-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
  }

  .game-info {
    margin-top: 10px;
  }
  </style>