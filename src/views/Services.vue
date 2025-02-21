<template>
  <div class="services">
    <!-- 用户数据展示 -->
    <div class="user-data">
      <h2>我的游戏数据</h2>
      <div class="data-section">
        <div class="data-card">
          <h3>游戏库</h3>
          <ul>
            <li v-for="game in userGames" :key="game.id">{{ game.name }}</li>
          </ul>
        </div>
        <div class="data-card">
          <h3>游戏时长</h3>
          <div ref="playtimeChart" style="width: 100%; height: 300px;"></div>
        </div>
        <div class="data-card">
          <h3>游戏成就</h3>
          <p>已解锁成就：{{ unlockedAchievements }} / {{ totalAchievements }}</p>
        </div>
      </div>
    </div>
     <!-- 游戏排行榜 -->
     <div class="game-rank">
      <h2>游戏下载排行榜</h2>
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th>游戏名称</th>
            <th>评分</th>
            <th>价格</th>
            <th>类型</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(game, index) in topGames" :key="game.id">
            <td>{{ index + 1 }}</td>
            <td>{{ game.name }}</td>
            <td>{{ game.rating }}</td>
            <td>{{ game.price }}</td>
            <td>{{ game.genre }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 style="padding: 20px;">游戏数据</h2>
  <div class="chart-container">
    <!-- 柱状图 -->
    <div class="chart1 echarts" ref="barChart"></div>

    <!-- 饼图 -->
    <div class="chart2 echarts" ref="pieChart"></div>

    <!-- 箱线图 -->
    <div class="chart3 echarts" ref="boxPlot"></div>

     <!-- 树状图 -->
     <div class="chart4 echarts" ref="treeChart"></div>

    <!-- 热力图 -->
     <div class="chart5 echarts" ref="heatmapChart"></div>

     <!-- 网络图 -->
    <div class="chart6 echarts" ref="networkChart"></div>
  </div>
</div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'GameRatingChart',
  data () {
    return {
      userGames: [{
        id: 1,
        name: '王者荣耀'

      }], // 用户游戏库
      unlockedAchievements: 0, // 已解锁成就
      totalAchievements: 0, // 总成就
      playtimeData: [], // 游戏时长数据
      topGames: [] // 游戏排行榜数据
    }
  },
  mounted () {
    this.initBarChart()
    this.initPieChart()
    this.initBoxPlot()
    this.initTreeChart()
    this.initHeatmapChart()
    this.initNetworkChart()
    // this.fetchUserData()// 获取用户数据
    // this.fetchTopGames() // 获取游戏排行榜数据
    // 响应式处理
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeUnmount () { // 改为 beforeUnmount
    // 移除事件监听
    window.removeEventListener('resize', this.resizeCharts)
  },
  methods: {
    // 初始化柱状图
    initBarChart () {
      this.barChart = echarts.init(this.$refs.barChart)

      const option = {
        title: {
          text: '游戏评分分布（柱状图）',
          left: 'center',
          textStyle: {
            color: 'white' // 标题颜色
          }
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: ['0-1', '2-3', '4-5', '6-7', '8-9', '10']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [1, 4, 5, 10, 15, 20], // 根据实际数据修改
            type: 'bar'
          }
        ]
      }

      this.barChart.setOption(option)
    },

    // 初始化饼图
    initPieChart () {
      this.pieChart = echarts.init(this.$refs.pieChart)

      const option = {
        title: {
          text: '游戏评分分布（饼图）',
          left: 'center',
          textStyle: {
            color: 'white' // 标题颜色
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '评分',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 35, name: '好评' },
              { value: 25, name: '中评' },
              { value: 40, name: '差评' }
            ], // 根据实际数据修改
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      this.pieChart.setOption(option)
    },
    // 初始化箱线图
    initBoxPlot () {
      const boxPlot = echarts.init(this.$refs.boxPlot)

      const option = {
        title: {
          text: '游戏价格分布（箱线图）',
          left: 'center',
          textStyle: {
            color: 'white' // 标题颜色
          }
        },
        tooltip: {
          trigger: 'item'
        },
        xAxis: {
          type: 'category',
          data: ['游戏价格']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '价格',
            type: 'boxplot',
            data: [
              [30, 50, 100, 200, 500] // 最低值、第一四分位数、中位数、第三四分位数、最大值（你可以根据实际数据调整）
            ],
            tooltip: {
              formatter: function (param) {
                return [
                  '最低: ' + param.data[0],
                  '第一四分位数: ' + param.data[1],
                  '中位数: ' + param.data[2],
                  '第三四分位数: ' + param.data[3],
                  '最大值: ' + param.data[4]
                ].join('<br/>')
              }
            }
          }
        ]
      }

      boxPlot.setOption(option)
    },
    // 初始化树状图
    initTreeChart () {
      const treeChart = echarts.init(this.$refs.treeChart)

      const option = {
        title: {
          text: '游戏类型占比（树状图）',
          left: 'center',
          textStyle: {
            color: 'white'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'// 展示类型名称、数量、百分比
        },
        series: [
          {
            type: 'tree',
            name: '游戏类型',
            data: [
              {
                name: '全部游戏',
                children: [
                  {
                    name: '动作类',
                    value: 100,
                    children: [
                      { name: '射击游戏', value: 60 },
                      { name: '格斗游戏', value: 40 }
                    ]
                  },
                  {
                    name: '策略类',
                    value: 80,
                    children: [
                      { name: '即时战略', value: 50 },
                      { name: '回合制策略', value: 30 }
                    ]
                  },
                  {
                    name: '角色扮演',
                    value: 120,
                    children: [
                      { name: '冒险类', value: 70 },
                      { name: '模拟类', value: 50 }
                    ]
                  }
                ]
              }
            ],
            top: '10%',
            left: '10%',
            bottom: '10%',
            right: '10%',
            symbolSize: 15,
            lineStyle: {
              width: 2,
              color: '#aaa'
            },
            label: {
              position: 'right',
              formatter: '{b}',
              fontSize: 12,
              color: 'white'
            },
            emphasis: {
              focus: 'descendant',
              itemStyle: {
                color: '#ff7f50'
              }
            }
          }
        ]
      }

      treeChart.setOption(option)
    },
    // 生成模拟热力图数据
    generateHeatmapData () {
      const data = []
      for (let i = 0; i < 24; i++) { // 小时 (X轴)
        for (let j = 0; j < 7; j++) { // 星期 (Y轴)
          data.push([i, j, Math.floor(Math.random() * 100)]) // 模拟玩家活跃度
        }
      }
      return data
    },

    // 初始化热力图
    initHeatmapChart () {
      const heatmapChart = echarts.init(this.$refs.heatmapChart)

      const option = {
        title: {
          text: '游戏玩家活力图（热力图）',
          left: 'center',
          textStyle: {
            color: 'white'
          }
        },
        tooltip: {
          position: 'top',
          formatter: (params) => {
            return `时间: ${params.data[0]}点, 星期${params.data[1] + 1} <br> 活跃度: ${params.data[2]}`
          }
        },
        grid: {
          top: '10%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 24 }, (_, i) => `${i}:00`), // X轴：24小时制
          boundaryGap: true, // 设置 boundaryGap 为 true
          axisLine: { lineStyle: { color: '#bbb' } }
        },
        yAxis: {
          type: 'category',
          data: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'], // Y轴：星期
          boundaryGap: true, // 设置 boundaryGap 为 true
          axisLine: { lineStyle: { color: '#bbb' } }
        },
        visualMap: {
          min: 0,
          max: 100,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '0%',
          inRange: { color: ['#ffffff', '#fdae61', '#d73027'] } // 颜色从白色到红色
        },
        series: [
          {
            name: '活跃度',
            type: 'heatmap',
            data: this.generateHeatmapData(),
            label: {
              show: false // 关闭标签显示
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      heatmapChart.setOption(option)
      this.heatmapChart = heatmapChart
    },
    // 初始化网络图
    initNetworkChart () {
      const networkChart = echarts.init(this.$refs.networkChart)

      const option = {
        title: {
          text: '游戏推荐关系图',
          left: 'center',
          textStyle: {
            color: 'white'
          }
        },
        tooltip: {
          formatter: (params) => {
            if (params.dataType === 'node') {
              return `${params.data.name}` // 显示节点游戏名
            }
            return `${params.data.source} → ${params.data.target}` // 显示边的关系
          }
        },
        series: [
          {
            type: 'graph',
            layout: 'force', // 使用力导向图布局
            symbolSize: 50,
            roam: true, // 允许拖动
            edgeSymbol: ['none', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              show: true,
              formatter: (params) => {
                return `${params.data.source} → ${params.data.target}`
              }
            },
            data: [
              { name: '游戏A', category: 0 },
              { name: '游戏B', category: 0 },
              { name: '游戏C', category: 1 },
              { name: '游戏D', category: 1 },
              { name: '游戏E', category: 2 }
            ],
            links: [
              { source: '游戏A', target: '游戏B' },
              { source: '游戏A', target: '游戏C' },
              { source: '游戏B', target: '游戏D' },
              { source: '游戏C', target: '游戏E' }
            ],
            categories: [
              { name: '动作类' },
              { name: '冒险类' },
              { name: '角色扮演类' }
            ],
            lineStyle: {
              color: 'source',
              curveness: 0.3
            }
          }
        ]
      }

      networkChart.setOption(option)
      this.networkChart = networkChart
    },

    // 响应式调整图表大小
    resizeCharts () {
      if (this.barChart) this.barChart.resize()
      if (this.pieChart) this.pieChart.resize()
      if (this.boxPlot) this.boxPlot.resize()
      if (this.treeChart) this.treeChart.resize()
      if (this.heatmapChart) this.heatmapChart.resize()
      if (this.networkChart) this.networkChart.resize()
    }
  }
}
</script>

<style scoped>
.services{
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), url('../assets/wallhaven-rrl1kj.jpg');
  background-size: cover;
  background-position: center;
}
.chart-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
}
.user-data {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
}

.data-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.data-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
}
.game-rank {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

th {
  background-color: rgba(255, 255, 255, 0.2);
}

h2, h3 {
  color: white;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  color: white;
  margin: 5px 0;
}
.echarts {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
  width: 100%;
  margin-top:20px ;
}
</style>
