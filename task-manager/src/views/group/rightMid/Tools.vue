<template>
  <el-drawer v-model="isAdjustTasks" title="任务调整" direction="btt" size="100%" style="height: 100%">
    <GanttChart :users="curSelectTasksReceiverList" :selectedMonth="getYearAndMonth(curSeletMonthDate)" />
  </el-drawer>
  <el-drawer v-model="isAssessment" title="绩效考核" direction="btt" size="100%" style="height: 100%">
    <Assessment></Assessment>
  </el-drawer>
  <div class="tool-container">
    <el-radio-group v-model="curTaskType" size="small">
      <el-radio-button v-for="item in taskStatusArray" :label="item.label" :value="item.value" />
    </el-radio-group>
    <el-button type="primary" @click="isAdjustTasks = true">任务调整</el-button>
    <el-button type="primary" @click="dispatchTasks">下发</el-button>
    <el-button type="primary" @click="isAssessment = true">绩效考核</el-button>
    <el-button type="primary">导出</el-button>
    <el-button type="primary">日志</el-button>
  </div>
</template>
<script setup>

import GanttChart from './GanttChart.vue'
import Assessment from './Assessment.vue'
import { ref } from 'vue'
import { taskStatusArray } from "@/constants/public"

import { useGroupStore } from '@/stores/group.js'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
const groupStore = useGroupStore();
import { getFisrtAndLastDayOfMonth, getYearAndMonth, getWeeksInMonth, isTaskInWeek } from '@/utils/public'
const { curTaskType, curSelectTasksReceiverList, curSeletMonthDate } = storeToRefs(groupStore);
const isAdjustTasks = ref(false);
const isAssessment =ref(false);
const dispatchTasks = async () => {
  // 如果当前用户不是所选组的leader， 则不允许下发
  const [status, msg] = await groupStore.dispatchTask()
  if (status) {
    ElMessage.success(msg)
  } else {
    ElMessage.error(msg)
  }
}

</script>
<style scoped>
.tool-container {
  width: 100%;
  display: flex;
  align-items: center;
  height: 7vh;
  background: white;
  margin-top: 1vh;
  gap: 10px;
}
</style>
<script>
</script>