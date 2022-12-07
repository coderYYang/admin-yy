<template>
  <div class='reports'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div id='main' style='width: 100%; height: 400px; margin: 0 auto;'></div>
    </el-card>
  </div>
</template>

<script>
// 导入 echarts
import echarts from 'echarts'
import { TimeReports } from '@/api/api'

export default {
  name: 'Reports',
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    // 准备好 dom，创建 echarts
    const myChart = echarts.init(document.querySelector('#main'));

    TimeReports().then(res => {
      if (res.data.meta.status === 200) {
        // 准备数据配置项
        const obj = Object.assign(this.options, res.data.data)
        // 展示数据
        myChart.setOption(obj)
      } else {
        ElMessage.error(res.data.meta.msg);
      }
    })
  }
}
</script>

<style scoped>

</style>
