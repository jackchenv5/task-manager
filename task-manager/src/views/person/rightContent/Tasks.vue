<template>
  <div>
    <div style="width: 50vw; overflow: auto; position: relative; border: 1px solid #ebeef5; border-radius: 4px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);">
      <vxe-table
        border
        :max-height="tableMaxHeight"
        :data="filteredTasks"
        :row-config="{ isHover: true }"
      >
        <vxe-column field="name" title="任务名" width="120" show-overflow></vxe-column>
        <vxe-column field="status_name" title="状态" width="110"></vxe-column>
        <vxe-column field="start_date" title="开始时间" width="120" show-overflow></vxe-column>
        <vxe-column field="end_date" title="截止时间" width="120" show-overflow></vxe-column>
        <vxe-column field="workload" title="工作量(天)" width="100"></vxe-column>
        <vxe-column field="project" title="项目" width="130" show-overflow></vxe-column>
        <vxe-column field="creator_name" title="创建人" width="110"></vxe-column>
        <vxe-column title="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button class="feedback-el-button" type="primary" size="small" @click="handleFeedbackClick(row)">反馈</el-button>
            <el-button class="check-el-button" type="primary" size="small" @click="handleCheckDetail(row)">详情</el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    
    <el-drawer
      v-model="isOpen"
      :title="`任务反馈 - 任务名：${ feedbackData.name }`"
      direction="btt"
      size="50%"
    >
      <el-form label-width="auto" style="width: 100%;">
        
        <el-form-item>
          <div style="display: flex; align-items: center;">
            <div style="display: flex; align-items: center; margin-right: 40px; margin-left: 20px;">
              <el-text style="margin-right: 10px;">实际工作量:</el-text>
              <el-input-number v-model="feedbackData.act_workload" :min="1" :max="30" />
            </div>
            <div style="display: flex; align-items: center;">
              <el-text style="margin-right: 20px;">进度:</el-text>
              <el-slider v-model="feedbackData.progress" show-input :step="10" show-stops style="width: 350px;" />
            </div>
          </div>
        </el-form-item>
        
        <el-form-item style="margin-bottom: 10px">
          <el-input
            v-model="feedbackData.feedback" 
            type="textarea" 
            :rows="10"
            placeholder="请输入反馈信息..."
          />
        </el-form-item>
        
        <el-form-item style="margin-bottom: 0">
          <el-button type="primary" @click="handleFeedbackSubmit" style="width: 120px;">提交</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <TaskDetail 
        v-model:visible="showDetailPanel"
        :task="currentTask"
      />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import TaskDetail from './TaskDetail.vue'

import {usePersonStore  } from '@/stores/person.js'

import {  storeToRefs } from 'pinia'

const personStore = usePersonStore();
const {filteredTasks} = storeToRefs(personStore);

const showDetailPanel = ref(false)
const currentTask = ref({})

const handleCheckDetail = (row) => {
  currentTask.value = row
  showDetailPanel.value = true
}


const props = defineProps({
  filteredTasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['row-click', 'row-dblclick', 'feedback-submit'])

const tableMaxHeight = computed(() => window.innerHeight * 0.72)

const isOpen = ref(false)
const feedbackData = ref({})

const handleFeedbackClick = (row) => {
    if (row.status_name != '进行中') {
      ElMessage.warning(`当前任务状态：{${row.status_name}} 无法反馈`)
      return
    }
    feedbackData.value = {id:row.id , name:row.name, progress: row.progress, feedback: row.feedback,act_workload:row.act_workload}
    isOpen.value = true
  }
  
const handleFeedbackSubmit = async () => {
  if (feedbackData.value.progress === 0) {
    ElMessage.warning("进度不能为0")
    return
  }
  if (feedbackData.value.info === '') {
    ElMessage.warning("反馈信息不能为空")
    return
  }
  try {
    await myPersonStore.feedbackTask(feedbackData.value.id,feedbackData.value)
    ElMessage.success("反馈成功！")
  } catch (err) {
    ElMessage.error(`反馈失败：${err}`)
  }
  
  isOpen.value = false
}

</script>