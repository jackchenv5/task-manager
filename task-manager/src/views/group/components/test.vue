<template>
  <div class="gantt-wrapper">
    <!-- 顶部控制栏 - 仿 user-panel 风格 -->
    <div class="gantt-control-bar">
      <div class="member-panel">
        <el-row class="panel-header">
          <el-col :span="8">
            <h3 class="card-title">参与人员</h3>
          </el-col>
          <el-col :span="4" :offset="12">
            <el-button class="clear-btn" @click="selectedMember = ''">清空</el-button>
          </el-col>
        </el-row>
        <el-scrollbar class="user-scrollbar">
          <div class="user-tags">
            <el-tag 
              v-for="member in members" 
              :key="member.id" 
              :class="['user-tag', { 'active': member.id === selectedMember }]"
              @click="handleSelectMember(member)"
            >
              {{ member.name }}
            </el-tag>
          </div>
        </el-scrollbar>
      </div>

      <div class="workload-panel">
        <div class="workload-header">
          <h3 class="card-title">本周繁忙度</h3>
        </div>
        <div class="workload-content">
          <el-progress 
            :percentage="workloadPercentage" 
            :color="workloadColor"
            :stroke-width="16"
            :format="formatWorkload"
          />
        </div>
      </div>

      <el-button 
        type="primary" 
        class="confirm-button" 
        @click="handleConfirm"
      >
        确定
      </el-button>
    </div>

    <!-- 甘特图容器 -->
    <div class="gantt-container" ref="ganttContainer"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElTag, ElButton, ElProgress, ElScrollbar, ElRow, ElCol } from 'element-plus';

// 组员数据
const members = ref([
  { id: 343, name: "钟丽", workload: 35 },
  { id: 344, name: "李罗洪", workload: 70 },
  { id: 345, name: "王波", workload: 50 },
  { id: 346, name: "丁保军", workload: 85 }
]);

const selectedMember = ref('');
const handleSelectMember = (member) => {
  selectedMember.value = member.id;
  // 自动更新繁忙度显示
  workloadPercentage.value = member.workload;
};

// 繁忙度计算
const workloadPercentage = ref(0);
const workloadColor = computed(() => {
  if (workloadPercentage.value < 50) return '#67C23A';
  if (workloadPercentage.value < 80) return '#E6A23C';
  return '#F56C6C';
});
const formatWorkload = (p) => `${p}%`;

// 确定按钮逻辑
const handleConfirm = () => {
  console.log('当前选择:', {
    member: selectedMember.value,
    workload: workloadPercentage.value
  });
  // 这里可以添加数据提交或其他业务逻辑
};
</script>

<style scoped>
/* 整体布局 */
.gantt-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 控制栏样式 */
.gantt-control-bar {
  display: flex;
  align-items: stretch;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 12px;
  margin-bottom: 12px;
  gap: 20px;
}

/* 人员面板样式 */
.member-panel {
  flex: 2;
  min-width: 300px;
}

/* 繁忙度面板样式 */
.workload-panel {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
}

.workload-header {
  margin-bottom: 8px;
}

.workload-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

/* 共用标题样式 */
.card-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 8px 8px;
  font-weight: 600;
  border-left: 3px solid #409eff;
  padding-left: 8px;
}

/* 清空按钮 */
.clear-btn {
  float: right;
  padding: 6px 12px;
  background: #f5f7fa;
  border: none;
  color: #606266;
}

/* 人员标签样式 */
.user-scrollbar {
  height: 100px;
}

.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px;
}

.user-tag {
  cursor: pointer;
  border-radius: 12px;
  padding: 6px 12px;
  transition: all 0.3s ease;
  background: #f5f7fa;
  color: #606266;
  border: 1px solid #e4e7ed;
}

.user-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-tag.active {
  background: linear-gradient(135deg, #409EFF 0%, #3375B9 100%);
  color: white;
  border: none;
}

/* 确定按钮 */
.confirm-button {
  align-self: center;
  margin-left: auto;
  padding: 8px 20px;
}

/* 甘特图容器 */
.gantt-container {
  flex: 1;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>