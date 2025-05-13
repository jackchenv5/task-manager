<template>
  <div>
    <div style="width: 50vw; overflow: auto; position: relative; border: 1px solid #ebeef5; border-radius: 4px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);">
      <vxe-table
        border
        max-height="600"
        :data="filteredTasks"
        :row-config="{ isHover: true }"
        :row-class-name="tableRowClassName"
        @cell-click="handleCellClick"
        @cell-dblclick="handleCellDblClick"
      >
        <vxe-column field="name" title="任务名" width="120" show-overflow></vxe-column>
        <vxe-column field="status_name" title="状态" width="110"></vxe-column>
        <vxe-column field="start_date" title="开始时间" width="120" show-overflow></vxe-column>
        <vxe-column field="end_date" title="截止时间" width="120" show-overflow></vxe-column>
        <vxe-column field="workload" title="工作量(天)" width="100"></vxe-column>
        <vxe-column field="project" title="项目" width="130" show-overflow></vxe-column>
        <vxe-column field="creator_name" title="创建人" width="110"></vxe-column>
        <vxe-column title="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link size="small" @click.stop="handleFeedbackClick(row)">反馈</el-button>
            <el-button link size="small" @click.stop="handleDetailClick(row)">详情</el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    
    <div v-if="selectedRow" style="width:100%;">
      <el-form label-width="auto" style="width: 100%; margin-top: 10px;">
        <el-form-item label="任务反馈:" style="margin-bottom: 10px;">
          <el-text type="primary" style="margin-left: 10px;">{{ selectedRow.name }}</el-text>
        </el-form-item>
        
        <el-form-item style="margin-bottom: 22px;">
          <div style="display: flex; align-items: center;">
            <div style="display: flex; align-items: center; margin-right: 40px; margin-left: 20px;">
              <el-text style="margin-right: 10px;">实际工作量:</el-text>
              <el-input-number v-model="feedbackData.actWorkload" :min="1" :max="30" />
            </div>
            <div style="display: flex; align-items: center;">
              <el-text style="margin-right: 20px;">进度:</el-text>
              <el-slider v-model="feedbackData.progress" show-input :step="10" show-stops style="width: 350px;" />
            </div>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-input
            v-model="feedbackData.info" 
            type="textarea" 
            :rows="10"
            placeholder="请输入反馈信息..."
          />
        </el-form-item>
        
        <el-form-item style="margin-left: 40%">
          <el-button type="primary" @click="handleSubmit" style="width: 120px;">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  filteredTasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['row-click', 'row-dblclick', 'feedback-submit'])

const selectedRow = ref(null)
const feedbackData = ref({
  actWorkload: 1,
  progress: 0,
  info: ''
})

const tableRowClassName = ({ row }) => {
  return selectedRow.value?.id === row.id ? 'highlight-row' : ''
}

const handleCellClick = ({ row }) => {
  selectedRow.value = row
  emit('row-click', row)
}

const handleCellDblClick = ({ row }) => {
  emit('row-dblclick', row)
}

const handleFeedbackClick = (row) => {
  selectedRow.value = row
  emit('row-click', row)
}

const handleDetailClick = (row) => {
  emit('row-dblclick', row)
}

const handleSubmit = () => {
  if (feedbackData.value.progress === 0) {
    ElMessage.warning("进度不能为0")
    return
  }
  if (feedbackData.value.info === '') {
    ElMessage.warning("反馈信息不能为空")
    return
  }
  
  emit('feedback-submit', {
    taskId: selectedRow.value.id,
    ...feedbackData.value
  })
  
  // 重置表单
  feedbackData.value = {
    actWorkload: 1,
    progress: 0,
    info: ''
  }
  selectedRow.value = null
}

</script>
