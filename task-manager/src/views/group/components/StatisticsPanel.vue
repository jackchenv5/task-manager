<template>
  <el-card class="statistics-panel">
    <div class="statistic-item">
      <div class="statistic-title">任务饱和度</div>
      <el-progress 
        type="dashboard" 
        :percentage="avgSaturation" 
        :color="saturationColor"
        :width="120"
      />
    </div>
    
    <el-divider />
    
    <div class="statistic-grid">
      <div class="statistic-card">
        <div class="statistic-value">{{ completedTasks }}</div>
        <div class="statistic-label">已完成任务</div>
      </div>
      
      <div class="statistic-card">
        <div class="statistic-value">{{ totalWorkload }}</div>
        <div class="statistic-label">总工作量(h)</div>
      </div>
      
      <div class="statistic-card">
        <div class="statistic-value">{{ pendingTasks }}</div>
        <div class="statistic-label">待完成量</div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'

// 模拟任务数据
const tasks = ref([
  { id: 1, name: '首页改版', status: '进行中', assignee: 1, project: 1, weeks: [5, 3, 0, 0, 0], saturation: [70, 80, 0, 0, 0] },
  { id: 2, name: 'API开发', status: '已完成', assignee: 2, project: 2, weeks: [8, 0, 0, 0, 0], saturation: [90, 0, 0, 0, 0] },
  { id: 3, name: '测试用例', status: '待下发', assignee: 3, project: 1, weeks: [0, 0, 0, 0, 0], saturation: [0, 0, 0, 0, 0] }
])

const avgSaturation = computed(() => {
  if (tasks.value.length === 0) return 0
  const total = tasks.value.reduce((sum, task) => sum + task.saturation[0], 0)
  return Math.round(total / tasks.value.length)
})

const completedTasks = computed(() => {
  return tasks.value.filter(task => task.status === '已完成').length
})

const totalWorkload = computed(() => {
  return tasks.value.reduce((sum, task) => sum + task.weeks.reduce((wSum, w) => wSum + w, 0), 0)
})

const pendingTasks = computed(() => {
  return tasks.value.filter(task => task.status !== '已完成').length
})

const saturationColor = computed(() => {
  if (avgSaturation.value > 90) return '#f56c6c'
  if (avgSaturation.value > 80) return '#e6a23c'
  if (avgSaturation.value > 60) return '#67c23a'
  return '#909399'
})
</script>

<style scoped>
.statistics-panel {
  height: 100%;
}

.statistic-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.statistic-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.statistic-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.statistic-card {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 15px;
  text-align: center;
}

.statistic-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.statistic-label {
  font-size: 14px;
  color: #909399;
}
</style>