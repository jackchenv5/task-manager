<template>
  <el-drawer v-model="isAdjustTasks" title="任务调整" direction="btt" size="100%" style="height: 100%">
    <GanttChart :users="curSelectTasksReceiverList" :selectedMonth="getYearAndMonth(curSeletMonthDate)" />
  </el-drawer>
  <el-drawer v-model="isAssessment" title="绩效考核" direction="btt" size="100%" style="height: 100%">
    <Assessment></Assessment>
  </el-drawer>
  <el-drawer  v-model="isGroupLog" title="小组动态" :with-header="false" direction="ltr" size="65%">
    <template v-for="item in groupLogs" :key="item.id"  style="margin: 10px; 0">
      <div class="log-container" v-if="item.title">
        <span class="log-item">{{ item.timestamp }}</span>
        <span  class="log-item">{{ item.title }}</span>
      </div>
      <div v-else  class="log-container">
        <span class="log-item">{{ item.timestamp }}</span>
        <span class="log-item">{{ item.changed_fields.receiver_name }}</span>
        <span class="log-item">{{ item.action === 'created' ? "新增任务" : '修改任务' }}</span>
        <span class="log-item">{{ item.changed_fields.name }}</span>
        <span class="log-item">创建人：{{ item.changed_fields.creator_name }}</span>
      </div>
      <ChangeView  :changed-fields="item.changed_fields"></ChangeView>
    </template>

  </el-drawer>
  <div class="tool-wrapper">
    <div class="tool-container">
      <el-radio-group v-model="curTaskType"  fill="#6cf" size="small">
      <el-radio-button v-for="item in taskStatusArray" :label="item.label" :value="item.value" />
    </el-radio-group>
    <el-button type="primary" @click="isAdjustTasks = true" style="margin-left: 5px;">任务调整</el-button>
    <el-button type="primary" @click="dispatchTasks">下发</el-button>
      <el-button type="warning" @click="reportTasks">发送组周告</el-button>
    <el-button type="primary" @click="isAssessment = true" >绩效考核</el-button>
      <el-badge :value="groupLogs.length" class="item" style="margin-left: 5px;">
        <el-button  @click="isGroupLog = true">小组动态</el-button>
      </el-badge>

    </div>
    <!-- <el-button type="primary">日志</el-button> -->
  </div>
</template>
<script setup>
import {ElButton,ElRadioGroup,ElBadge,ElRadioButton,ElDrawer} from "element-plus";

import { getYearAndMonth } from '@/utils/public'
import GanttChart from './GanttChart.vue'
import Assessment from './Assessment.vue'
import ChangeView from '@/components/changeDetail/ChangeDetail.vue'
import { ref } from 'vue'
import { taskStatusArray } from "@/constants/public"

import { useGroupStore } from '@/stores/group.js'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import {taskReport} from '@/api/data/data'
const groupStore = useGroupStore();
const { curTaskType, curSelectTasksReceiverList, curSeletMonthDate,groupLogs } = storeToRefs(groupStore);
import { useUserStore } from '@/stores/user'
const myUserStore = useUserStore()
const { loginUser } = storeToRefs(myUserStore)

const isAdjustTasks = ref(false);
const isAssessment =ref(false);
const isGroupLog =ref(false);
const dispatchTasks = async () => {
  // 如果当前用户不是所选组的leader， 则不允许下发
  const [status, msg] = await groupStore.dispatchTask()
  if (status) {
    ElMessage.success(msg)
  } else {
    ElMessage.error(msg)
  }
}

const reportTasks = async () => {
  taskReport({type:'组报告',user:loginUser.value.username}).then(
      ElMessage.success('组报告已发送！')
  )
}


</script>
<style scoped>
.tool-container {
  padding: 0 15px;
  margin-top: 1vh;
  width: 100%;
  display: flex;
  align-items: center;
  height: 7vh;
  background: white;
  border-radius: 10px;
}
.log-container{
  font-size: 1rem;
  display: flex;
  width: 100%;
  align-items: center;
}
.log-item{
  margin: 10px 5px;
}
</style>