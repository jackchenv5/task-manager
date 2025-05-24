<template>
  <div class="weeksRef-container">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <el-button class="allSelect-el-button" type="primary" @click="selectedAll">全选</el-button>
      </div>
      <p style="flex: 1; text-align: center;font-size:large;font-weight:600">{{ getYearAndMonth(curSeletMonthDate,true) }}</p>
      <div class="month-selected-button">
        <el-button @click="prevMonth">< </el-button>
            <el-button type="info" @click="goToday">本月</el-button>
            <el-button @click="nextMonth">></el-button>
      </div>
    </div>

    <div class="table-header">
      <div class="header-cell" v-for="header in headers" :key="header">
        {{ header }}
      </div>
    </div>

    <div class="table-body">
      <div class="table-row" v-for="userName in selectGroupUsers" :key="userName">
        <div class="table-cell user-cell" @click="changeUserData(userName)">{{ userName }}</div>
        <div class="table-cell week-cell" v-for="(week, index) in weeksRef" :key="index"
          :style="{ backgroundColor: getSaturationColor(userName, index) }" @click="changeUserWeekData(userName, week)">
          <div>
            {{ getTaskCount(userName, index) }} <br> {{ getSaturation(userName, index) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { isTaskInWeek, calWorkdays,getYearAndMonth,getWorkdaysInWeek,getUserWeeksDataMap} from '@/utils/public'

import {useGroupStore  } from '@/stores/group.js'
import {  storeToRefs } from 'pinia'
const groupStore = useGroupStore();
const {weeksRef,curSeletMonthDate,selectGroupUsers,allTask} = storeToRefs(groupStore);

// 获取表头
const headers = computed(() => {
  return ['用户名', ...weeksRef.value.map(week => week.label)]
})

// 获取用户每一周的任务情况， 任务总数和饱和度
const userTaskData = computed(() => {
  return getUserWeeksDataMap(allTask.value,weeksRef.value,selectGroupUsers.value)
})

// 根据用户名和weekIndex获取其背景色、任务总数、饱和度
const getSaturationColor = (userName, index) => {
  return userTaskData.value[userName] ? userTaskData.value[userName][index]['bgColor'] : '#eee'
}

const getTaskCount = (userName, index) => {
  return userTaskData.value[userName] ? userTaskData.value[userName][index]['count'] : 0
}

const getSaturation = (userName, index) => {
  return userTaskData.value[userName] ? userTaskData.value[userName][index]['saturation'] : 0
}

const changeUserData = (userName) => {
  groupStore.changeSelectUserName(userName)
}

const changeUserWeekData = (userName, week) => {
  groupStore.changeWeek(userName,week)
}

const selectedAll = () => {
  groupStore.cleanUser()
}
// 月份导航方法
const prevMonth = () => {
  groupStore.changeMonth(true)
}

const nextMonth = () => {
  groupStore.changeMonth(false)
}

const goToday = () => {
  groupStore.goToday()
}
</script>
<style>
.weeksRef-container {
  width: 100%;
  height: 80vh;
  background-color: white;
  /* border: 1px solid #eee; */
  margin-top: 5px;
}

.table-header {
  display: flex;
  border-bottom: 1px solid #ebeef5;
  padding: 12px 0;
  font-weight: bold;
  background-color: #f5f7fa;
}

.header-cell {
  flex: 1;
  text-align: center;
  padding: 0 10px;
}

.table-body {
  max-height: 56vh;
  overflow-y: auto;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #ebeef5;
  padding: 12px 0;
}

.table-cell {
  flex: 1;
  text-align: center;
  padding: 0 10px;
}

.user-cell {
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  border-radius: 4px;
  margin: 0 5px;
  background: #C5FBC8;
  cursor: pointer;
}

.week-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  border-radius: 4px;
  margin: 0 5px;
  color: white;
  cursor: pointer;
}

.user-cell:hover {
  border: 2px solid black;
}

.week-cell:hover {
  border: 2px solid black;
}
</style>