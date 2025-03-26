<template>
    <div v-if="game" class="game-detail">
      <h1 class="game-title">{{ game.name }}</h1>
      <img :src="game.image_url" alt="Game Cover" class="game-cover">

      <div class="game-info">
        <p><strong>发行时间：</strong>{{ game.converted_release_date || '未知' }}</p>
        <p><strong>开发商：</strong>{{ game.developer || '未知' }}</p>
        <p><strong>发行商：</strong>{{ game.publisher || '未知' }}</p>
        <p><strong>支持语言：</strong>{{ game.languages }}</p>
        <p><strong>类型：</strong>{{ game.genres }}</p>
        <p><strong>类别：</strong>{{ game.categories }}</p>
        <p><strong>折扣：</strong>{{ game.discount_percent }}%</p>
        <p><strong>价格：</strong>{{ game.final_price }} {{ game.currency }}</p>
        <p><strong>评分：</strong>{{ game.metacritic_score || '暂无评分' }}</p>
        <p><strong>总评价数：</strong>{{ game.total_reviews }}</p>
        <p><strong>是否支持 VR：</strong>{{ game.vr_support === '1' ? '是' : '否' }}</p>
        <p><strong>是否支持多人：</strong>{{ game.multiplayer === '1' ? '是' : '否' }}</p>
        <p><strong>游戏介绍：</strong>{{ game.short_description }}</p>
        <p v-html="game.description"></p>
      </div>

      <!-- 游戏截图 -->
      <div class="screenshots" v-if="game.screenshots.length">
        <h2>游戏截图</h2>
        <div class="screenshot-list">
          <img v-for="(screenshot, index) in game.screenshots"
               :key="index"
               :src="screenshot"
               alt="Screenshot">
        </div>
      </div>

      <!-- 游戏视频 -->
      <div class="videos" v-if="game.videos.length">
        <h2>游戏视频</h2>
        <div class="video-list">
            <video
              :v-for="(video, index) in game.videos"
              :key="index"
              :src="video"
              controls
             ></video>
        </div>
      </div>

      <!-- 下载链接 -->
      <a :href="game.store_url" target="_blank">
        <button class="download-btn">前往 Steam 商店</button>
      </a>
    </div>
    <div v-else class="loading">加载中...</div>
  </template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      game: null
    }
  },
  async created () {
    const gameId = this.$route.params.id
    try {
      const response = await axios.get(`http://127.0.0.1:5000/gameDetail/${gameId}`)
      this.game = response.data
    } catch (error) {
      console.error('获取游戏详情失败', error)
    }
  }
}
</script>

  <style scoped>
  .game-detail {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .game-cover {
    width: 100%;
    max-width: 600px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .game-info p {
    font-size: 16px;
    line-height: 1.5;
  }

  .screenshot-list img {
    width: 100%;
    max-width: 300px;
    margin: 10px;
    border-radius: 8px;
  }

  .video-list video {
    width: 100%;
    max-width: 500px;
    margin: 10px;
  }
  .download-btn {
    background-color: #ff9800;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-size: 18px;
    border-radius: 5px;
    margin-top: 20px;
  }

  .download-btn:hover {
    background-color: #e68900;
  }

  .loading {
    font-size: 20px;
    color: gray;
  }
  </style>
