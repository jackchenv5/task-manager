<template>
  <div class="chart-wrapper">
    <!-- 查询工具栏 -->
  <el-form :model="queryForm" label-width="80px" class="query-toolbar" inline>
    <el-form-item label="项目">
        <Select style="width: 450px" v-model="queryForm.project" :api="getProjectList" label-field="name" value-field="name" filterable  clearable :filter-field="['name']"></Select>
    </el-form-item>
    
    <el-form-item label="创建人">
              <Select
                  style="width: 140px"
                  v-model="queryForm.creator"
                  :api="getUserApi"
                  label-field="username"
                  value-field="id"
                  filterable
                  clearable
                  :filter-field="['username', 'emp_num', 'email']"
              ></Select>
    </el-form-item>
    
    <el-form-item label="开始时间">
      <el-date-picker
        v-model="queryForm.start_time"
        type="month"
        placeholder="选择开始月份"
        value-format="YYYY-MM"
        clearable
      />
    </el-form-item>
    
    <el-form-item label="结束时间">
      <el-date-picker
        v-model="queryForm.deadline_time"
        type="month"
        placeholder="选择结束月份"
        value-format="YYYY-MM"
        clearable
      />
    </el-form-item>
    

    
    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
    
    <!-- 图表容器 -->
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, reactive } from 'vue'
import Select from '@/components/selects/MutiSelect.vue'
import * as echarts from 'echarts'
import { getFisrtAndLastDayOfMonth, formatDate, TaskStatus, getLastSixMonthsRange, getLastSixMonthsMonthRange, formatMonth } from '@/utils/public'
import {
  ElMessage,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElButton
} from 'element-plus'
import { getProjectList, getUserApi, getTaskDataApi } from '@/api/data/data'

const chartRef = ref(null)
let chartInstance = null

// 查询表单数据
const queryForm = reactive({
  project: '',
  creator: '',
  start_time: getLastSixMonthsMonthRange()[0], // 默认近6个月开始月份
  deadline_time: getLastSixMonthsMonthRange()[1]   // 默认近6个月结束月份
})

// 项目选项（真实数据）
const projectOptions = ref([])



// 处理真实任务数据，按月份分组计算工作量
const processTaskData = (tasks, startDate, endDate) => {
  console.log('processTaskData参数:', tasks, startDate, endDate)
  
  let start, end
  
  // 如果startDate和endDate没有传值，使用tasks中的时间范围
  if (!startDate || !endDate) {
    console.log('使用tasks中的时间范围')
    // 获取所有任务的时间范围
    const taskDates = tasks
      .filter(task => task.start_time)
      .map(task => new Date(task.start_time))
      .sort((a, b) => a - b)
    
    if (taskDates.length > 0) {
      start = taskDates[0] // 最早的任务开始时间
      end = taskDates[taskDates.length - 1] // 最晚的任务开始时间
      console.log('使用tasks时间范围:', formatMonth(start), '到', formatMonth(end))
    } else {
      // 如果没有任务数据，使用默认的最近6个月范围
      const defaultRange = getLastSixMonthsRange()
      start = new Date(defaultRange[0])
      end = new Date(defaultRange[1])
      console.log('使用默认时间范围:', formatMonth(start), '到', formatMonth(end))
    }
  } else {
    // 使用传入的日期范围
    start = new Date(startDate) // startDate已经是完整日期格式
    end = new Date(endDate)     // endDate已经是完整日期格式
    console.log('处理日期范围:', formatMonth(start), '到', formatMonth(end))
  }
  
  const dates = []
  const plannedWorkload = []
  const actualWorkload = []
  
  // 创建月份范围映射
  const monthMap = {}
  let currentDate = new Date(start)
  
  while (currentDate <= end) {
    const monthStr = formatMonth(currentDate)
    console.log('添加月份:', monthStr)
    dates.push(monthStr)
    monthMap[monthStr] = { planned: 0, actual: 0 }
    currentDate.setMonth(currentDate.getMonth() + 1)
  }
  
  // 处理每个任务的工作量（简化版：只根据start_time所在月份分配）
  tasks.forEach(task => {
    if (task.start_time) {
      const taskStart = new Date(task.start_time)
      const monthStr = formatMonth(taskStart)
      
      if (monthMap[monthStr]) {
        // 编排工作量（计划工作量）
        monthMap[monthStr].planned += task.workload || 0
        
        // 实际工作量（使用API返回的act_workload字段）
        monthMap[monthStr].actual += task.act_workload || 0
      }
    }
  })
  
  // 填充工作量数组
  dates.forEach(month => {
    plannedWorkload.push(Math.round(monthMap[month].planned))
    actualWorkload.push(Math.round(monthMap[month].actual))
  })
  console.log('dates===>',dates)
  console.log('plannedWorkload:',plannedWorkload)
  console.log('actualWorkload:',actualWorkload)
  return { dates, plannedWorkload, actualWorkload }
}



const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

// 组件挂载时加载数据
onMounted(async () => {
  initChart()
  // 组件挂载后自动加载真实数据
  handleQuery()
})

// 更新图表配置
const updateChart = () => {
  if (!chartInstance) return
  
  // 使用空数据初始化图表
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: function(params) {
        const month = params[0].axisValue
        const planned = params[0].data
        const actual = params[1].data
        const completionRate = planned > 0 ? ((actual / planned) * 100).toFixed(1) : 0
        
        // 根据完成率设置颜色
        let rateColor = '#67C23A' // 默认绿色（高完成率）
        if (completionRate < 80) {
          rateColor = '#F56C6C' // 红色（低完成率）
        } else if (completionRate < 90) {
          rateColor = '#E6A23C' // 橙色（中等完成率）
        }
        
        return `月份: ${month}<br/>` +
               `<span style="color:${params[0].color};">●</span> 编排工作量: ${planned}天<br/>` +
               `<span style="color:${params[1].color};">●</span> 实际工作量: ${actual}天<br/>` +
               `<span style="color:${rateColor};">●</span> 符合度: <span style="color:${rateColor};font-weight:bold;">${completionRate}%</span>`
      }
    },
    legend: {
      data: ['编排工作量', '实际工作量'],
      top: 10,
      right: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '60px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266',
        formatter: function(value) {
          // 确保显示年月格式（YYYY-MM）
          if (value && typeof value === 'string' && value.includes('-')) {
            return value // 直接返回年月格式
          }
          // 如果值不是标准格式，尝试格式化
          try {
            const date = new Date(value)
            if (!isNaN(date.getTime())) {
              const year = date.getFullYear()
              const month = (date.getMonth() + 1).toString().padStart(2, '0')
              return `${year}-${month}`
            }
          } catch (e) {
            // 格式化失败，返回原始值
          }
          return value
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '工作量（天）',
      nameTextStyle: {
        color: '#606266'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        formatter: '{value}',
        color: '#606266'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e4e7ed'
        }
      }
    },
    series: [
      {
        name: '编排工作量',
        type: 'line',
        data: [],
        itemStyle: {
          color: '#409EFF'
        },
        lineStyle: {
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.6)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}天'
        }
      },
      {
        name: '实际工作量',
        type: 'line',
        data: [],
        itemStyle: {
          color: '#67C23A'
        },
        lineStyle: {
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.6)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.1)' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}天'
        }
      },
      {
        name: '交叉区域',
        type: 'line',
        data: [],
        lineStyle: {
          opacity: 0
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 193, 7, 0.6)' },
            { offset: 1, color: 'rgba(255, 193, 7, 0.1)' }
          ])
        },
        tooltip: {
          show: false
        }
      }
    ]
  }
  
  chartInstance.setOption(option)
}

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}



// 将月份格式转换为完整日期格式（当月1号到当月最后一天）
const convertMonthToDateRange = (monthStr) => {
  if (!monthStr) return ''
  
  const [year, month] = monthStr.split('-')
  const date = new Date(year, month - 1, 1)
  
  if (monthStr.includes('-')) {
    // 如果是月份格式，返回当月第一天
    return formatDate(date)
  }
  
  // 如果不是月份格式，返回原始值
  return monthStr
}

// 获取月份的最后一天
const getMonthLastDay = (monthStr) => {
  if (!monthStr) return ''
  
  const [year, month] = monthStr.split('-')
  const lastDay = new Date(year, month, 0) // 当月最后一天
  return formatDate(lastDay)
}

// 查询处理
const handleQuery = async () => {
  try {
    console.log('查询参数:', queryForm)
    
    // 转换月份格式为完整日期格式
    const startDate = convertMonthToDateRange(queryForm.start_time)
    const endDate = getMonthLastDay(queryForm.deadline_time)
    
    // 构建API查询参数
    const params = {
      creator: queryForm.creator || '',
      project: queryForm.project || '',
      start_time: startDate || '',
      deadline_time: endDate || '',
      status: TaskStatus.FINISH
    }
    
    console.log('转换后的查询参数:', params)
    
    // 调用真实API获取任务数据
    const response = await getTaskDataApi(params)
    
    if (response && response.length > 0) {
      // 处理真实数据，按日期分组计算工作量
      const processedData = processTaskData(response, startDate, endDate)
      
      // 更新图表数据
      if (chartInstance) {
        const option = {
          xAxis: {
            data: processedData.dates
          },
          series: [
            { data: processedData.plannedWorkload },
            { data: processedData.actualWorkload },
            { data: processedData.plannedWorkload.map((planned, index) => 
                Math.min(planned, processedData.actualWorkload[index])
              )
            }
          ]
        }
        chartInstance.setOption(option)
      }
      
      ElMessage.success('数据查询成功')
    } else {
      ElMessage.warning('暂无相关数据')
    }
  } catch (error) {
    console.error('数据查询失败:', error)
    ElMessage.error('数据查询失败')
  }
}

// 重置表单
const handleReset = () => {
  queryForm.project = ''
  queryForm.creator = ''
  queryForm.start_time = getLastSixMonthsRange()[0] // 重置为近6个月第一天
  queryForm.deadline_time = getLastSixMonthsRange()[1]   // 重置为近6个月最后一天
  
  // 重置后重新查询数据
  handleQuery()
  
  ElMessage.success('重置成功')
}

// 监听容器尺寸变化
let resizeObserver = null

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
  
  // 使用ResizeObserver监听容器尺寸变化
  if (chartRef.value && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(resizeChart)
    resizeObserver.observe(chartRef.value)
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', resizeChart)
  
  // 清理ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.query-toolbar {
  background: white;
  padding: 16px 20px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.query-toolbar :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 16px;
}

.query-toolbar :deep(.el-select) {
  width: 140px;
}

.query-toolbar :deep(.el-date-editor) {
  width: 140px;
}

.chart-container {
  flex: 1;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .query-toolbar :deep(.el-form-item) {
    margin-right: 12px;
  }
  
  .query-toolbar :deep(.el-select),
  .query-toolbar :deep(.el-date-editor) {
    width: 120px;
  }
}

@media (max-width: 992px) {
  .query-toolbar {
    padding: 12px;
  }
  
  .query-toolbar :deep(.el-form-item) {
    margin-right: 8px;
  }
  
  .query-toolbar :deep(.el-select),
  .query-toolbar :deep(.el-date-editor) {
    width: 100px;
  }
}
</style>