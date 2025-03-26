<template>
  <el-card>
    <h2>好友正在玩的游戏</h2>
    <el-table :data="friendGamesList" border style="width: 100%">
      <el-table-column prop="friend" label="好友 Steam ID" width="200"></el-table-column>
      <el-table-column prop="game" label="游戏"></el-table-column>
      <el-table-column prop="hours" label="游戏时长（小时）" width="180"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  computed: {
    ...mapState(['user'])// 从 Vuex Store 中获取用户信息
  },
  data () {
    return {
      friendGamesList: []
    }
  },
  created () {
    this.fetchFriendGames()
  },
  methods: {
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
        this.friendGamesList.value = gamesList
      } catch (error) {
        console.error('获取好友游戏数据失败', error)
      }
    }
  }
}
</script>