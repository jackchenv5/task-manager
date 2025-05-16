<template>
  <div class="dashboard-container">
    <!-- 项目进度卡片 -->
    <div class="metric-card progress-card">
      <h3 class="card-title">项目进度</h3>
      <div class="card-content">
        <div class="ratio-label">{{ workLoadSta.completed.toFixed(0) }}天/{{ workLoadSta.total.toFixed(0) }}天</div>
        <el-progress 
          type="dashboard" 
          :percentage="workLoadSta.progress.toFixed(0)" 
          :stroke-width="12" 
          :width="70"
          class="clean-progress"
        />
      </div>
    </div>

    <!-- 工作强度卡片 -->
    <div class="metric-card intensity-card">
      <h3 class="card-title">项目调度</h3>
      <div class="card-content">
        <div class="card-item" >
          <div style="color: #ca1a1a;  font-size: 16px;">{{ pendTasks }}个</div>
          <div style="font-size: 12px;">待下发</div>
        </div>
        <div class="card-item">
          <div style="color: #160ac0;  font-size: 16px;">{{ runTasks }}个</div>
          <div style="font-size: 12px;">进行中</div>
          </div>
      </div>
    </div>

    <!-- 统计数据卡片 -->
    <div class="stats-card">
      <h3 class="card-title">项目级统计数据</h3>
      <div class="stats-list">
        <div class="stat-item">项目时间：{{ dateRange.start_date }}~{{ dateRange.end_date }}</div>
        <div class="stat-item">参与人数：{{ joinUsers.length }}人</div>
        <div class="stat-item">任务数(草稿|进行中|待下发|已完成|所有任务)：{{draftTasks}}|{{ runTasks }} | {{ pendTasks }} | {{completedTasks}} | {{ totalTasks }}</div>
        <div class="stat-item">总工时：{{ workLoadSta.completed.toFixed(0) }}天/{{ workLoadSta.total.toFixed(0) }}天({{ workLoadSta.progress.toFixed(0) }}%)</div>
      </div>
    </div>
  </div>
</template>
<script setup>

import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()
const {joinUsers, dateRange, workLoadSta, totalTasks,completedTasks,pendTasks,runTasks,draftTasks, workloadIntensity } = storeToRefs(projectStore)

</script>

<style scoped>
/* 基础容器布局 [3,6](@ref) */
.dashboard-container {
  display: flex;
  gap: 12px;
  height: 18vh;
  width: 98%;
  padding: 5px;
}

/* 统一卡片样式 [6,7](@ref) */
.metric-card {
  flex: 1;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: box-shadow 0.2s ease;
}

.metric-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* 标题样式优化 [6](@ref) */
.card-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 8px 8px;
  font-weight: 600;
  border-left: 3px solid #409eff;
  padding-left: 8px;
}

/* 内容区域布局 */
.card-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: calc(100% - 30px);
}

/* 数据标签样式 */
.metric-label {
  font-size: 13px;
  color: #606266;
  background: #f5f7fa;
  padding: 6px 12px;
  border-radius: 16px;
}

.ratio-label {
  font-size: 14px;
  color: #909399;
}

.card-item {
  display: flex;
  flex-direction: column;
  color: #909399;
}

/* 统计数据卡片 [7](@ref) */
.stats-card {
  flex: 0 0 45%;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px;
}

.stats-list {
  padding: 0 0;
}

/* 进度条样式覆盖 [6](@ref) */
:deep(.clean-progress) {
  --el-progress-text-color: #409eff;
  --el-progress-border-color: #e4e7ed;
}

:deep(.clean-progress .el-progress-circle__track) {
  stroke: #f0f2f5;
}

/* 滚动条美化 [7](@ref) */
:deep(.el-scrollbar__thumb) {
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 3px;
}

:deep(.el-scrollbar__thumb:hover) {
  background-color: rgba(144, 147, 153, 0.5);
}


.stat-item {
  /* 基础样式 */
  font-size: 12px;
  color: #2c3e50;
  margin: 2px 0;
  background: white;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  /* 焦点边框效果 */
  border: 1px solid transparent;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

/* 悬停效果 */
.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.12);
  background: #f1f3f5;
}

/* 焦点状态 */
.stat-item:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64,158,255,0.2);
}

/* 激活状态微动效 */
.stat-item:active {
  transform: scale(0.98);
}

/* 添加优雅的入场动画 */
@keyframes itemEntrance {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-item {
  animation: itemEntrance 0.4s ease forwards;
}

/* 添加右侧状态指示条 */
.stat-item::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: #409eff;
  opacity: 0;
  transition: opacity 0.3s;
}

.stat-item:hover::after {
  opacity: 0.3;
}
</style>