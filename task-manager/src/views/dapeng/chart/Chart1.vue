<template>
  <div style="width:25%;height: 100%;" ref="chart1Ref"></div>
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
      text: '班组生产数据对比',
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
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      },
      formatter: params => {
        const output = []
        params.forEach(item => {
          if (item.seriesName.includes('产量')) {
            output.push(`
              <div style="display:flex;align-items:center;margin-bottom:5px;">
                <span style="display:inline-block;width:10px;height:10px;background:${item.color};margin-right:5px;border-radius:2px;"></span>
                ${item.seriesName}: <strong>${item.value}件</strong>
              </div>
            `)
          } else {
            output.push(`
              <div style="display:flex;align-items:center;margin-bottom:5px;">
                <span style="display:inline-block;width:10px;height:10px;border:2px solid ${item.color};margin-right:5px;border-radius:50%;"></span>
                ${item.seriesName}: <strong>${item.value}%</strong>
              </div>
            `)
          }
        })
        return `<div>班组: ${params[0].axisValue}</div>` + output.join('')
      }
    },
    legend: {
      data: ['产量', '合格率'],
      top: 30,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { 
        fontSize: 12,
        padding: [0, 5, 0, 0]
      }
    },
    grid: {
      left: '15%',
      right: '15%',
      top: '20%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['早班', '中班', '晚班'],
      axisLabel: {
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '产量(件)',
        nameTextStyle: {
          fontSize: 10,
          padding: [0, 0, 0, 30]
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
      {
        type: 'value',
        name: '合格率(%)',
        min: 0,
        max: 100,
        interval: 20,
        nameTextStyle: {
          fontSize: 10,
          padding: [0, 0, 0, 30]
        },
        axisLabel: {
          fontSize: 10,
          formatter: '{value}%'
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '产量',
        type: 'bar',
        barWidth: '30%',
        data: [1500, 1450, 1350],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 1, color: '#188df0' }
          ]),
          borderRadius: [2, 2, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}件'
        }
      },
      {
        name: '合格率',
        type: 'line',
        yAxisIndex: 1,
        data: [98.5, 97.2, 96.8],
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#ff6b6b'
        },
        lineStyle: {
          width: 3,
          color: '#ff6b6b'
        },
        label: {
          show: true,
          formatter: '{c}%',
          position: 'top'
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