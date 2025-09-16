<template>
  <div class="weeks-container">
    <div class="weeks-wrapper">
      <div class="toolbar">
      <div style="margin-left: 15px;">
        <el-button class="allSelect-el-button" type="primary" @click="selectedAll">全选</el-button>
      </div>
      <p style="flex: 1; text-align: center;font-size:large;font-weight:600">{{ getYearAndMonth(curSeletMonthDate,true) }}</p>
      <div style="margin-right: 20px;">
        <el-button @click="prevMonth">< </el-button>
            <el-button type="warning" @click="goToday">本月</el-button>
            <el-button @click="nextMonth">></el-button>
      </div>
    </div>
    <div class="table-header">
      <div class="header-cell" v-for="header in headers" :key="header">
        {{ header }}
      </div>
    </div>

    <el-scrollbar class="table-body">
      <div class="table-row" v-for="userName in selectGroupUsers" :key="userName">
        <div class="table-cell user-cell" @click="changeUserData(userName)">{{ userName }}</div>
        <div class="table-cell week-cell" v-for="(week, index) in weeksRef" :key="index"
          :style="{ backgroundColor: getSaturationColor(userName, index),'user-active':userActive }" @click="changeUserWeekData(userName, week)">
          <div>
            {{ getTaskCount(userName, index) }} <br> {{ getSaturation(userName, index) }}%
          </div>
        </div>
      </div>
    </el-scrollbar>
    </div>

  </div>
</template>
<script setup>

import { ElButton, ElScrollbar } from 'element-plus'


import { ref, computed,shallowRef,watchEffect } from 'vue'
import { getYearAndMonth,getUserWeeksDataMap} from '@/utils/public'

import {useGroupStore  } from '@/stores/group.js'
import {  storeToRefs } from 'pinia'
const groupStore = useGroupStore();
const {weeksRef,curSeletMonthDate,selectGroupUsers,allTask} = storeToRefs(groupStore);

// 获取表头
const headers = computed(() => {
  return ['用户名', ...weeksRef.value.map(week => week.label)]
})


const userTaskData = shallowRef({});

watchEffect(() => {
  userTaskData.value = getUserWeeksDataMap(allTask.value, weeksRef.value, selectGroupUsers.value);
});


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
const userActive = ref(false)
const changeUserWeekData = (userName, week) => {
  userActive.value = true
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
.weeks-container {
  /* padding: 10px; */
  /* margin:5px; */
  width: 50vw;
  /* margin-left: 5px; */
  /* border-radius: 10px; */
  /* width: 47vw; */
  /* margin-top: 10 solid black; */
  /* border:  1px solid rgb(144 156 181); */
  height: 80vh;
  /* background-color: white; */
  display: flex;
  flex-direction: column;
}

.weeks-wrapper {
  padding: 5px 10px;
  /* background-color: white; */
}

.toolbar {
  margin-top: 1vh;
  width: 100%;
  display: flex;
  align-items: center;
  height: 7vh;
  background: white;
  border-radius: 10px;
  /* border-right: 1px solid #eee; */
  /* margin-top: 1vh; */
  gap: 10px;
}

.table-header {
  margin-top: 1vh;
  display: flex;
  /* border-bottom: 1px solid #ebeef5; */
  border-radius: 10px;
  padding: 12px 0;
  font-weight: bold;
  background-color: #3b6363;
  color  : white;
}

.header-cell {
  flex: 1;
  border-left: 1px solid #ebeef5;
  text-align: center;
  padding: 0 10px;
}

.table-body {
  margin-top: 1vh;
  height: 63vh;
  background-color: white;
  border-radius: 10px;

}

.table-row {
  display: flex;
  border-bottom: 1px solid #b0b4bb;
  padding: 12px 0;
}
.table-row:hover {
  background-color: rgb(243, 243, 206);
  opacity:0.6;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease-in-out;
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
  background: #a3abad;
  color: white;
  cursor: pointer;
  border-left:3px solid rgba(47, 69, 110, 0.986);
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

.week-cell:hover {
  border-radius: 15px;
  box-shadow: 0 0 5px rgba(253, 2, 2, 0.5);
  opacity: 1; 
  transition: all 0.3s ease-in-out;
}

.user-active {
  background: #a3abad;
  color: white;
  border: 3px solid rgb(196, 164, 164);  /* 红色边框突出选中 */
  box-shadow: 0 0 5px rgba(235, 178, 178, 0.7);  /* 可选：添加发光效果 */
}

/* .week-cell:hover {
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
} */
</style>