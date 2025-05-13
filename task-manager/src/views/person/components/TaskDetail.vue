<template>
  <el-drawer
    v-model="drawerVisible"
    title="任务详情"
    direction="ltr"
    size="50%"
  >
    <div class="detail-grid">
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">任务名称</span>
          <el-input 
            v-model="task.name" 
            readonly 
            class="detail-input"
            :title="task.id"
          />
        </div>
        <div class="detail-item">
          <span class="detail-label">工作量</span>
          <el-input 
            :value="task.workload + ' 天'" 
            readonly 
            class="detail-input"
          />
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item full-width">
          <span class="detail-label">邮件抄送</span>
          <el-input
            type="textarea"
            :rows="3"
            :value="task.sender || '无'"
            readonly
            resize="none"
            class="detail-textarea cc-textarea"
          />
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item full-width">
          <span class="detail-label">开始时间 - 截止时间</span>
          <el-input 
            :value="`${task.start_time} 至 ${task.deadline_time}`" 
            readonly 
            class="detail-input"
          />
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item full-width">
          <span class="detail-label">项目</span>
          <el-input 
            :value="`${task.project || '无'}`" 
            readonly 
            class="detail-input"
          />
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item full-width">
          <span class="detail-label">关联任务</span>
          <el-input 
            :value="`${task.related_task || '无'}`" 
            readonly 
            class="detail-input"
          />
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item full-width">
          <span class="detail-label">任务内容</span>
          <el-input
            type="textarea"
            :rows="3"
            :value="`${task.content || '无'}`"
            readonly
            resize="none"
            class="detail-textarea"
          />
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item full-width">
          <span class="detail-label">挑战目标</span>
          <el-input
            type="textarea"
            :rows="3"
            :value="`${task.challenge || '无'}`"
            readonly
            resize="none"
            class="detail-textarea"
          />
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item full-width">
          <span class="detail-label">详细描述</span>
          <el-input
            type="textarea"
            :rows="4"
            :value="task.description || '无'"
            readonly
            resize="none"
            class="detail-textarea"
          />
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">完成度</span>
          <el-progress 
            :percentage="parseInt(task.progress || 0)" 
            :status="getProgressStatus(task.progress)"
            style="width: 200px;"
          />
        </div>
        <div class="detail-item">
          <span class="detail-label">实际工作量</span>
          <el-input 
            :value="(task.act_workload || '0') + ' 天'" 
            readonly 
            class="detail-input"
          />
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item full-width">
          <span class="detail-label">反馈记录</span>
          <el-input
            type="textarea"
            :rows="4"
            :value="task.feedback || '无反馈记录'"
            readonly
            resize="none"
            class="detail-textarea"
          />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { getProgressStatus } from '@/utils/public'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:visible'])

const drawerVisible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})
</script>

<style scoped>
.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.detail-row {
  display: flex;
  gap: 20px;
}

.detail-item {
  flex: 1;
}

.detail-item.full-width {
  min-width: 100%;
}

.detail-label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #606266;
}

.detail-input {
  width: 100%;
}

.detail-input :deep(.el-input__inner) {
  background-color: #f5f7fa;
  color: #606266;
  cursor: default;
}

.detail-textarea {
  width: 100%;
}

.detail-textarea :deep(.el-textarea__inner) {
  background-color: #f5f7fa;
  color: #606266;
  cursor: default;
  font-family: inherit;
}

.cc-textarea :deep(.el-textarea__inner) {
  height: 80px;
  overflow-y: auto;
}
</style>