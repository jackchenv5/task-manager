<template>
  <div class="stat-container">
    <!-- 标签页导航 -->
    <el-tabs 
      v-model="activeTab" 
      type="card" 
      @tab-change="handleTabChange"
      class="stat-tabs"
    >
      <el-tab-pane 
        v-for="stat in statStore.supportedStats" 
        :key="stat.value"
        :label="stat.name" 
        :name="String(stat.value)"
      >
        <!-- 图表内容直接放在tab-pane内 -->
        <component 
          :is="currentChart"
          v-if="currentChart && activeTab === String(stat.value)"
        />
      </el-tab-pane>
    </el-tabs>
    
    <!-- 空状态 -->
    <el-empty 
      v-if="!currentChart" 
      description="请选择要显示的统计图表" 
      class="empty-chart"
    />
  </div>
</template>

<script setup>
import { ElTabs, ElTabPane, ElEmpty } from "element-plus"
import { useNavStore } from '@/stores/stat'
import { ref, computed, watch } from 'vue'
import { StatType } from '@/constants/public.js'

// 动态导入图表组件
import TaskSaturationChart from './charts/TaskSaturationChart.vue'

const statStore = useNavStore()

// 当前激活的标签页
const activeTab = ref('')

// 根据激活的标签页获取对应的图表组件
const currentChart = computed(() => {
  const tabValue = parseInt(activeTab.value)
  switch (tabValue) {
    case StatType.TASK_SATURATION:
      return TaskSaturationChart
    case StatType.TASK_WORKLOAD:
      return TaskWorkloadChart
    case StatType.PROJECT_PROGRESS:
      return ProjectProgressChart
    default:
      return null
  }
})

// 标签页切换处理
const handleTabChange = (tabName) => {
  activeTab.value = tabName
}

// 初始化时选择第一个标签页
if (statStore.supportedStats.length > 0) {
  activeTab.value = String(statStore.supportedStats[0].value)
}
</script>

<style scoped>
.stat-container {
  min-height: 88vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.stat-tabs {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-tabs :deep(.el-tabs__header) {
  margin: 0;
  border-bottom: 1px solid #e4e7ed;
}

.stat-tabs :deep(.el-tabs__content) {
  padding: 0;
  height: calc(100vh - 180px);
}

.stat-tabs :deep(.el-tab-pane) {
  height: 100%;
  padding: 0;
}

.empty-chart {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stat-container {
    padding: 12px;
  }
  
  .stat-tabs :deep(.el-tabs__content) {
    height: calc(100vh - 140px);
  }
}
</style>