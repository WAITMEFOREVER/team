<template>
  <div class="wishlist-page">
    <h1>我的愿望清单</h1>

    <div v-if="steamWishlist.length > 0">
      <div v-for="game in steamWishlist" :key="game.appid" class="game-item">
        <img :src="game.header_image" :alt="game.name" class="game-image" />
        <div class="game-info">
          <p>{{ game.name }}</p>
          <p>类型: {{ game.type }}</p>
          <p>原价: {{ game.price }}</p>
          <p>现价: {{ game.final_price }}</p>
          <p>折扣: {{ game.discount_percent }}</p>
          <p>免费游戏: {{ game.is_free_game ? '是' : '否' }}</p>
          <p>发布日期: {{ game.release_date }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>愿望清单为空</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      games: [], // 愿望清单的游戏列表
      steamWishlist: [] // Steam 平台的愿望清单

    }
  },
  computed: {
    ...mapState(['user']) // 将 Vuex 中的 user 映射到组件的计算属性
  },
  mounted () {
    this.fetchSteamWishlist()
  },
  methods: {
    fetchSteamWishlist () {
      const userId = this.user.id // 从用户数据中获取用户 ID
      axios.get(`http://127.0.0.1:5000/steam/wishlist/${userId}`)
        .then(response => {
          if (response.data.success) {
            this.steamWishlist = response.data.wishlist // 保存愿望清单
          } else {
            console.error('获取愿望清单失败:', response.data.message)
          }
        })
        .catch(error => {
          console.error('获取愿望清单失败:', error)
        })
    },
    viewGameDetail (gameId) {
      // 跳转到游戏详情页
      this.$router.push(`/game/${gameId}`)
    },
    async removeFromWishlist (gameId) {
      try {
        const response = await axios.delete(`http://127.0.0.1:5000/steam/wishlist/${gameId}`)
        if (response.data.success) {
          // 从本地列表中移除游戏
          this.games = this.games.filter((game) => game.id !== gameId)
          alert('已移除！')
        }
      } catch (error) {
        console.error('移除失败:', error)
        alert('移除失败，请重试。')
      }
    }
  }
}
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
}
.game-item {
  display: flex;
  align-items: center;
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