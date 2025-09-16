<template>
  <div class="stat-container">
    <div class="stat-header">
      <h1>任务统计</h1>
      <p class="stat-description">查看任务完成情况、工作量统计和项目进度分析</p>
    </div>
    
    <div class="stat-content">
      <!-- 统计卡片区域 -->
      <div class="stat-cards">
        <div class="stat-card">
          <div class="card-header">
            <h3>任务总量</h3>
            <el-icon><Document /></el-icon>
          </div>
          <div class="card-content">
            <div class="stat-number">0</div>
            <div class="stat-label">个任务</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="card-header">
            <h3>已完成</h3>
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="card-content">
            <div class="stat-number">0</div>
            <div class="stat-label">个任务</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="card-header">
            <h3>进行中</h3>
            <el-icon><Clock /></el-icon>
          </div>
          <div class="card-content">
            <div class="stat-number">0</div>
            <div class="stat-label">个任务</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="card-header">
            <h3>总工作量</h3>
            <el-icon><DataAnalysis /></el-icon>
          </div>
          <div class="card-content">
            <div class="stat-number">0</div>
            <div class="stat-label">人天</div>
          </div>
        </div>
      </div>
      
      <!-- 图表区域 -->
      <div class="stat-charts">
        <div class="chart-section">
          <h3>任务状态分布</h3>
          <div class="chart-placeholder">
            <el-icon><PieChart /></el-icon>
            <p>饼图区域 - 待实现</p>
          </div>
        </div>
        
        <div class="chart-section">
          <h3>工作量趋势</h3>
          <div class="chart-placeholder">
            <el-icon><TrendCharts /></el-icon>
            <p>折线图区域 - 待实现</p>
          </div>
        </div>
      </div>
      
      <!-- 数据表格区域 -->
      <div class="stat-table">
        <h3>项目统计</h3>
        <div class="table-placeholder">
          <el-icon><Grid /></el-icon>
          <p>数据表格区域 - 待实现</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Document,
  CircleCheck,
  Clock,
  DataAnalysis,
  PieChart,
  TrendCharts,
  Grid
} from '@element-plus/icons-vue'

// 这里可以添加统计数据的获取逻辑
// 后续可以添加：任务统计、用户统计、项目统计等功能
</script>

<style scoped>
.stat-container {
  padding: 20px;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
}

.stat-header {
  margin-bottom: 24px;
}

.stat-header h1 {
  color: #303133;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.stat-description {
  color: #606266;
  margin: 8px 0 0 0;
  font-size: 14px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.card-header .el-icon {
  color: #409eff;
  font-size: 20px;
}

.card-content {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
}

.stat-label {
  color: #909399;
  font-size: 12px;
  margin-top: 4px;
}

.stat-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 16px;
}

.chart-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.chart-section h3 {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}

.chart-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.stat-table {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.stat-table h3 {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.table-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}

.table-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .stat-cards {
    grid-template-columns: 1fr;
  }
  
  .stat-charts {
    grid-template-columns: 1fr;
  }
}
</style>