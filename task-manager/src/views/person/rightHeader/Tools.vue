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
    <el-button type="primary" @click="isAdjustTasks = true">甘特图</el-button>
    <el-button type="primary" @click="isAssessment = true">月度绩效自评</el-button>
    <!-- <el-button type="primary">日志</el-button> -->
  </div>
</template>
<script setup>

import GanttChart from './GanttChart.vue'
import Assessment from './Assessment.vue'
import { ref } from 'vue'
import { taskStatusArray } from "@/constants/public"

import {usePersonStore  } from '@/stores/person.js'

import {  storeToRefs } from 'pinia'

const personStore = usePersonStore();
const {curTaskType} = storeToRefs(personStore);

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