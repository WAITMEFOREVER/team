 <template>
  <div class="common-layout">
    <!-- 头部 -->
    <div class="header">
      <h1>欢迎使用 Steam 游戏推荐系统</h1>
      <div>
        <span>“欢迎加入我们的大家庭！在这里，您将获得个性化的游戏推荐和精美的数据可视化，帮助您找到更多精彩游戏，让娱乐更具个性！”</span>
      </div>
      <!-- 轮播图 -->
      <el-carousel :interval="3000" arrow="always">
        <el-carousel-item v-for="(image, index) in images" :key="index">
          <img :src="image.src" :alt="image.alt" v-if="image.loaded" />
          <div v-else class="image-placeholder">加载中...</div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 推荐板块 -->
    <div class="recommendation-section">
      <!-- 热门游戏 -->
      <div class="hot-games">
        <h2>热门游戏</h2>
        <div class="card-container">
          <div class="card" v-for="(game) in hotGame" :key="game.id">
            <img :src="game.image_url" alt="Game Cover" class="card-image">
            <div class="card-content">
              <h3 class="game-title">{{ game.title }}</h3>
              <button class="details-button"><a :href="game.link" style="color: white;">查看详情</a></button>
            </div>
          </div>
        </div>
      </div>

      <!-- 个性化推荐 -->
      <div v-if="user" class="personalized-recommendations">
        <h2>为你推荐</h2>
        <div class="card-container">
          <div class="card" v-for="(game, index) in personalizedGames" :key="index">
            <img :src="game.image" alt="Game Cover" class="card-image">
            <div class="card-content">
              <h3 class="game-title">{{ game.title }}</h3>
              <p class="game-rating">推荐理由: {{ game.reason }}</p>
              <button class="details-button">查看详情</button>
            </div>
          </div>
        </div>
      </div>
      <el-button v-else plain @click="openLoginDialog" style="display: inline-block;">登录以查看个性化推荐……</el-button>

      <!-- 使用封装好的 AuthDialog 组件 -->
      <AuthDialog ref="authDialog" />

      <!-- 新游推荐 -->
      <div class="new-games">
        <h2>最新游戏</h2>
        <div class="card-container">
          <div class="card" v-for="(game, index) in newGames" :key="index">
            <img :src="game.image" alt="Game Cover" class="card-image">
            <div class="card-content">
              <h3 class="game-title">{{ game.title }}</h3>
              <p class="game-rating">发行日期: {{ game.releaseDate }}</p>
              <button class="details-button">查看详情</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="quick-access">
      <router-link to="/about">
        <button>游戏推荐</button>
      </router-link>
      <router-link to="/services">
        <button>数据可视化</button>
      </router-link>
      <router-link to="/profile">
        <button>个人中心</button>
      </router-link>
    </div>

    <!-- 页脚 -->
    <el-footer class="footer">
      <div class="footer-content">
        <!-- 版权信息 -->
        <div class="copyright">
          © 2024 Steam 游戏推荐系统. 保留所有权利.
        </div>

        <!-- 社交媒体链接 -->
        <div class="social-links">
          <a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i></a>
          <a href="https://facebook.com" target="_blank"><i class="fab fa-facebook"></i></a>
          <a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
        </div>

        <!-- 导航链接 -->
        <div class="footer-links">
          <a href="/about">关于我们</a>
          <a href="/privacy">隐私政策</a>
          <a href="/terms">服务条款</a>
          <a href="/contact">联系我们</a>
        </div>

        <!-- 联系信息 -->
        <div class="contact-info">
          <p>电子邮件: support@steamrecommend.com</p>
          <p>电话: +86 123 4567 890</p>
          <p>地址: 北京市海淀区中关村大街1号</p>
        </div>

        <!-- 订阅功能 -->
        <div class="newsletter">
          <p>订阅我们的新闻通讯，获取最新游戏推荐:</p>
          <form @submit.prevent="subscribe">
            <input type="email" v-model="email" placeholder="输入您的邮箱" required />
            <button type="submit">订阅</button>
          </form>
        </div>

        <!-- 合作伙伴 -->
        <div class="partners">
          <p>合作伙伴:</p>
          <a href="https://steam.com" target="_blank">
            <img src="path/to/steam-logo.png" alt="Steam" />
          </a>
          <a href="https://epicgames.com" target="_blank">
            <img src="path/to/epic-logo.png" alt="Epic Games" />
          </a>
        </div>
      </div>

      <!-- 网站地图 -->
      <div class="sitemap">
        <a href="/sitemap">网站地图</a>
      </div>

      <!-- 返回顶部按钮 -->
      <div class="back-to-top" :class="{ show: isVisible }">
        <button @click="scrollToTop">↑</button>
      </div>
    </el-footer>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import AuthDialog from '@/components/AuthDialog.vue'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    AuthDialog
  },
  computed: {
    ...mapState(['user'])// 从 Vuex Store 中获取用户信息
  },
  setup () {
    const isVisible = ref(false)

    const handleScroll = () => {
      isVisible.value = window.scrollY > 300
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      isVisible,
      scrollToTop
    }
  },
  data () {
    return {
      searchQuery: '',
      email: '',
      images: [
        { src: 'https://img0.baidu.com/it/u=4241198105,352643417&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500', alt: 'Image 1', loaded: false },
        { src: 'https://img1.baidu.com/it/u=901797205,2696406556&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500', alt: 'Image 2', loaded: false },
        { src: 'https://img0.baidu.com/it/u=3527753816,2751857748&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500', alt: 'Image 3', loaded: false }
      ],
      hotGames: [], // 全部游戏数据
      hotGame: [], // 随机选择的 18 个游戏
      personalizedGames: [
        { title: '游戏3', reason: '根据你喜欢的动作游戏推荐', image: 'https://example.com/game3.jpg' }
      ],
      newGames: [
        { title: '游戏4', releaseDate: '2023-10-01', image: 'https://example.com/game4.jpg' }
      ]
    }
  },
  created () {
    this.fetchHotTopGames()
  },
  methods: {
    subscribe () {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        alert('请输入有效的邮箱地址！')
        return
      }
      alert(`感谢订阅！我们将发送最新推荐到: ${this.email}`)
      this.email = ''
    },
    loadImage (image) {
      const img = new Image()
      img.src = image.src
      img.onload = () => {
        image.loaded = true
      }
    },
    // 打开登录弹窗
    openLoginDialog () {
      this.$refs.authDialog.loginDialogVisible = true
    },
    // 打开注册弹窗
    openRegisterDialog () {
      this.$refs.authDialog.registerDialogVisible = true
    },
    async fetchHotTopGames () {
      try {
        const response = await axios.get('http://127.0.0.1:5000/topgames')
        this.hotGames = response.data
        this.getRandomGames() // 调用随机选择方法
      } catch (error) {
        console.error('获取游戏排行榜失败:', error)
        console.error('错误详情:', error.response)
      }
    },
    getRandomGames () {
      // 从全部游戏数据中随机选择 18 个
      this.hotGame = this.shuffleArray(this.hotGames).slice(0, 18)
    },
    shuffleArray (array) {
      // 随机打乱数组
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }
  },
  mounted () {
    this.images.forEach(image => this.loadImage(image))
  }
}
</script>

<style scoped>
.common-layout{
  background-image: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,.8)), url('../assets/bg1.jpg');
  background-size: cover; /* 背景图片覆盖整个元素 */
  background-position: center; /* 背景图片居中 */
}
/* 头部样式 */
.header {
  height: 88vh;
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  text-align: center;
  color: white;
  /* background-color: #333; */
  padding-top:100px;
}

.header h1 {
  font-family: 'Cursive', sans-serif;
  font-size: 36px;
  margin-bottom: 15px;
}

.header span {
  font-family: 'Cursive', sans-serif;
  font-size: 22px;
  margin-bottom: 30px;
}
.header div{
  padding-bottom: 40px;
}
/* 轮播图 */
.el-carousel {
  width: 100%;
  height: 400px; /* 自定义高度 */
}

.el-carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保证图片铺满整个容器 */
}
/* 搜索框 */
.search-container {
  width: 60%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  margin-right: -1px;
}

.search-button {
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-left: none;
  border-radius: 0 4px 4px 0;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

/* 热门游戏推荐标题 */
.recommendation-section h2 {
  color: white;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin: 40px 0;
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

/* 查看详情按钮 */
.details-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.details-button:hover {
  background-color: #45a049;
}
/* 按钮 */
.quick-access {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 40px;
    padding-bottom: 20px;
}
.quick-access button {
    padding: 12px 24px;
    font-size: 16px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.quick-access button:hover {
    background-color: #218838;
}
/* 页脚样式 */
.footer {
  background-color: #333;
  color: black;
  padding: 20px;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.copyright {
  margin-bottom: 10px;
}

.social-links a {
  color: white;
  margin: 0 10px;
  font-size: 20px;
}

.footer-links a {
  color: black;
  margin: 0 10px;
  text-decoration: none;
}
.footer-links a:hover {
  text-decoration: underline;
}

.newsletter {
  margin-top: 20px;
  padding-bottom: 20px;
}

.newsletter input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.newsletter button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.newsletter button:hover {
  background-color: #0056b3;
}
/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  transition: opacity 0.3s ease; /* 添加过渡效果 */
  opacity: 0; /* 初始透明度为 0 */
}

.back-to-top.show {
  opacity: 1; /* 显示时透明度为 1 */
}

.back-to-top button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.back-to-top button:hover {
  background-color: #0056b3;
}
</style>