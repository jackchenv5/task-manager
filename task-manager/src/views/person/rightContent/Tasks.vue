<template>
    <div style="width: 100vw;flex:1;">
      <vxe-table
        border
        :data="filteredTasks"
        auto-resize
        min-height="100%"
        align="center"
        :row-config="{ isHover: true }"
      >
        <vxe-column field="name" title="任务名"  show-overflow sortable></vxe-column>
        <vxe-column field="status_name" title="状态"  sortable>
          <template #default="{ row }">
            <template v-if="TaskStatus.PROGRESS === row.status" >
              <svg xmlns="http://www.w3.org/2000/svg"  height="30" viewBox="0 0 48 48"><g fill="#052360"><path d="M30.5 13a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9m-9.04 4.282c-1.247.31-2.098.776-2.785 1.354c-1.03.868-1.862 2.12-2.986 4.088a2 2 0 1 1-3.473-1.985c1.119-1.957 2.25-3.788 3.883-5.162c1.704-1.436 3.79-2.248 6.603-2.561c1.176-.13 2.47-.104 3.683.437c1.273.569 2.203 1.588 2.837 2.95c.854 1.833 1.489 2.924 1.997 3.557c.245.303.416.444.513.507c.077.05.11.054.122.056h.001c.087.01.369 0 1.197-.367c.361-.16.755-.352 1.237-.587l.115-.056a54 54 0 0 1 1.784-.84a2 2 0 0 1 1.625 3.655a49 49 0 0 0-1.653.779l-.131.064c-.461.225-.925.452-1.36.644c-.9.398-2.05.83-3.297.679c-1.316-.16-2.33-.903-3.165-1.9l-2.733 5.273l3.78 4.918a2 2 0 0 1 .403 1.012l.832 7.996a2 2 0 1 1-3.978.414l-.774-7.433l-2.296-2.988l-.02.037l-.084-.172l-4.242-5.52a2 2 0 0 1-.282-1.934z"/><path d="m18.432 29.007l-1.472 3.96l-5.8-.46a2 2 0 1 0-.318 3.987l7.308.58a2 2 0 0 0 2.033-1.296l1.125-3.028z"/></g></svg>
            </template>
            <template v-if="TaskStatus.PEND === row.status" >
              <svg xmlns="http://www.w3.org/2000/svg"  height="30" style="color:#1d4167;" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8"/><path fill="currentColor" d="M12.5 7H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/></svg>
            </template>
            <template v-if="TaskStatus.FINISH === row.status" >
              <svg xmlns="http://www.w3.org/2000/svg"  height="30"  viewBox="0 0 16 16"><path fill="none" stroke="currentColor" stroke-linejoin="round" d="M5.5 2.5h-2v12h9v-12h-2m-5 6l2 2L11 7M5.5 1.5h5l-.625 2h-3.75z" stroke-width="1"/></svg>
            </template>

          </template>
        </vxe-column>
        <vxe-column title="进度"  sortable>
          <template #default="{ row }">
            <el-progress
                type="circle"
                :percentage="parseInt(row.progress || 0)"
                :stroke-width="8"
                show-text="false"
                :status="parseInt(row.progress || 0) === 100 ? 'success' : 'primary' "
                :width="35"
            ><span></span></el-progress>
          </template>
        </vxe-column>
        <vxe-column field="start_time" title="开始时间" show-overflow sortable></vxe-column>
        <vxe-column field="deadline_time" title="截止时间"  show-overflow></vxe-column>

<!--        <vxe-column field="workload" title="工作量(天)" width="100"></vxe-column>-->
        <vxe-column field="project" title="项目"  show-overflow></vxe-column>
        <vxe-column field="creator_name" title="创建人" ></vxe-column>
        <vxe-column title="操作" fixed="right" >
          <template #default="{ row }">
            <el-button class="feedback-el-button" type="primary" size="small" @click="handleFeedbackClick(row)">反馈</el-button>
            <el-button class="check-el-button" type="primary" size="small" @click="handleCheckDetail(row)">详情</el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <el-drawer
      v-model="isOpen"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="`任务反馈 - 任务名：${ feedbackData.name }`"
      direction="btt"
      size="90%"
    >
      <el-form label-width="auto" style="width: 100%;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务内容:" prop="content" >
              <el-input type="textarea" :rows="8" v-model="feedbackData.content"  disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="挑战目标:">
              <el-input disabled
                        type="textarea"
                        :rows="8"
                        v-model="feedbackData.challenge"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <div style="display: flex; align-items: center;">
            <div style="display: flex; align-items: center; margin-right: 40px; margin-left: 20px;">
              <el-text style="margin-right: 10px;">编排工作量:</el-text>
              <el-input-number v-model="feedbackData.workload"  disabled>
                <template #suffix>
                  <span>天</span>
                </template>
              </el-input-number>
            </div>
            <div style="display: flex; align-items: center; margin-right: 40px; margin-left: 10px;">
              <el-text style="margin-right: 10px;">实际工作量:</el-text>
              <el-input-number v-model="feedbackData.act_workload" :step="0.5" :min="0.0">
                <template #suffix>
                  <span>天</span>
                </template>
              </el-input-number>
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
            :rows="12"
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage,ElForm,ElFormItem,ElDrawer,ElButton,ElInput,ElSlider,ElInputNumber,ElProgress,ElRow,ElCol,ElText } from 'element-plus'


import TaskDetail from './TaskDetail.vue'

import {usePersonStore  } from '@/stores/person.js'
import { TaskStatus } from '@/utils/public'
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
    // if (row.status_name != '进行中') {
    //   ElMessage.warning(`当前任务状态：{${row.status_name}} 无法反馈`)
    //   return
    // }
    feedbackData.value = {id:row.id , name:row.name,content:row.content,challenge:row.challenge, progress: parseInt(row.progress), feedback: row.feedback,workload:row.workload,act_workload:row.act_workload}
    isOpen.value = true
  }
  
const handleFeedbackSubmit = async () => {
  // if (feedbackData.value.progress === 0) {
  //   ElMessage.warning("进度不能为0")
  //   return
  // }
  if (feedbackData.value.info === '') {
    ElMessage.warning("反馈信息不能为空")
    return
  }
  try {
    await personStore.feedbackTask(feedbackData.value.id,feedbackData.value)
    ElMessage.success("反馈成功！")
  } catch (err) {
    ElMessage.error(`反馈失败：${err}`)
  }
  
  isOpen.value = false
}

</script>