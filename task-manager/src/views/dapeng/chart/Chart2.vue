<template>
  <div style="width: 70%;" ref="chart1Ref"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const chart1Ref = ref(null)
let myChart = null

// 初始化图表
const initChart = () => {
  if (!chart1Ref.value) return
  
  // 确保容器有高度
  chart1Ref.value.style.height = '400px'
  
  myChart = echarts.init(chart1Ref.value)
  
  const option = {
    title: {
      text: '班组总产量对比',
      left: 'center',
      textStyle: { 
        color: '#333', 
        fontSize: 14,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { 
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(150,150,150,0.1)'
        }
      },
      formatter: params => {
        return params.map(item => `
          <div style="display:flex;align-items:center;">
            <span style="display:inline-block;width:10px;height:10px;background:${item.color};margin-right:5px;"></span>
            ${item.seriesName}: <strong>${item.value}</strong>
          </div>
        `).join('') + `<div>日期: ${params[0].axisValue}</div>`
      }
    },
    legend: {
      data: ['早班', '中班', '晚班'],
      top: 30,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { 
        fontSize: 12,
        padding: [0, 5, 0, 0]
      }
    },
    grid: {
      left: '15%',  // 增大左侧间距防止Y轴文字被截断
      right: '5%',
      top: '20%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['8/11', '8/12', '8/13', '8/14', '8/15', '8/16', '8/17'],
      axisLabel: {
        fontSize: 10,
        interval: 0 // 强制显示所有标签
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '产量(件)',
      nameTextStyle: {
        fontSize: 10,
        padding: [0, 0, 0, 30] // 调整名称位置
      },
      axisLabel: {
        fontSize: 10,
        formatter: '{value}'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        }
      }
    },
    series: [
      {
        name: '早班',
        type: 'bar',
        barWidth: '20%',
        data: [1200, 1400, 1000, 1350, 1250, 1500, 1300],
        itemStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 1, color: '#188df0' }
          ]),
          borderRadius: [2, 2, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ff9f7f' },
              { offset: 1, color: '#f759ab' }
            ])
          }
        }
      },
      {
        name: '中班',
        type: 'bar',
        barWidth: '20%',
        data: [1100, 1300, 950, 1250, 1150, 1450, 1200],
        itemStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#81d4bb' },
            { offset: 1, color: '#25c68f' }
          ]),
          borderRadius: [2, 2, 0, 0]
        }
      },
      {
        name: '晚班',
        type: 'bar',
        barWidth: '20%',
        data: [1050, 1250, 900, 1150, 1100, 1350, 1150],
        itemStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fd9d6e' },
            { offset: 1, color: '#ff6b6b' }
          ]),
          borderRadius: [2, 2, 0, 0]
        }
      }
    ]
  }

  myChart.setOption(option)
}

// 响应式调整
const resizeChart = () => {
  myChart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  myChart?.dispose()
})
</script>