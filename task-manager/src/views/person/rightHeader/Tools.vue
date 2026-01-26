<template>
  <el-drawer v-model="isAdjustTasks" title="本月任务甘特图" direction="btt" size="100%" style="height: 100%">
    <GanttChart />
  </el-drawer>
  <el-drawer v-model="isAssessment" title="绩效考核" direction="btt" size="100%" style="height: 100%">
    <Assessment></Assessment>
  </el-drawer>
  <div class="tool-container">
    <el-radio-group v-model="curTaskType" size="small">
      <el-radio-button v-for="item in taskStatusArray" :label="item.label" :value="item.value" />
    </el-radio-group>
    <el-button type="primary" @click="isAdjustTasks = true">甘特图</el-button>
    <el-button type="primary" @click="isAssessment = true">月度绩效自评</el-button>
    <!-- <el-button type="primary">日志</el-button> -->
    <div style="flex:1;">
      <span style="margin-left: 20px"> | </span>
      <el-button @click="prevMonth" style="margin-left: 20px;"><</el-button>
      <el-button type="warning" @click="curMonth" style="margin-left: 20px;">本月</el-button>
      <el-button @click="nextMonth" style="margin-left: 20px;">></el-button>
      <span style="margin-left: 20px"> | </span>
      <span style="margin-left: 20px;font-weight: bold;">{{ getYearAndMonth(curSeletMonthDate,true) }}</span>
    </div>
  </div>
</template>
<script setup>
import {ElDrawer,ElButton,ElRadioButton,ElRadioGroup} from "element-plus";
import GanttChart from './GanttChart.vue'
import Assessment from './Assessment.vue'
import { ref } from 'vue'
import { taskStatusArray } from "@/constants/public"
import { getYearAndMonth} from '@/utils/public'
import {usePersonStore  } from '@/stores/person.js'

import {  storeToRefs } from 'pinia'

const personStore = usePersonStore();
const {curTaskType,curSeletMonthDate} = storeToRefs(personStore);

const isAdjustTasks = ref(false)
const isAssessment = ref(false)
const prevMonth = ()=>{
  personStore.changeMonth(true)
}

const curMonth = ()=>{
  personStore.goToday()
}
const nextMonth = ()=>{
  personStore.changeMonth(false)
}
</script>
<style scoped>
.tool-container {
  width: 100%;
  display: flex;
  align-items: center;
  height: 7vh;
  background: white;
  /* margin-top: 1vh; */
  gap: 10px;
}
</style>
<script>
</script>