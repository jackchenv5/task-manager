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
import { isTaskInWeek, calWorkdays, getWorkdaysInWeek,getYearAndMonth } from '@/utils/public'

import {useGroupStore  } from '@/stores/group.js'
import {  storeToRefs } from 'pinia'
const groupStore = useGroupStore();
const {weeksRef,curSeletMonthDate,selectGroupUsers,allTask} = storeToRefs(groupStore);

// 获取表头
const headers = computed(() => {
  return ['用户名', ...weeksRef.value.map(week => week.label)]
})

const props = defineProps({
  users: {
    type: Array,
    required: true,
    default: () => []
  },
  totalTasks: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedStatus: {
    type: String,
    required: true,
    default: () => ""
  },
  selectedMonth: {
    type: Array,
    required: true,
    default: () => [new Date().getFullYear(), new Date().getMonth() + 1]
  }
})

const emit = defineEmits(['update:selectedMonth', 'update:selectedUser', 'update:selectedWeek', 'update:isLoading'])

// 计算当前月的周信息



// 获取用户每一周的任务情况， 任务总数和饱和度
const userTaskData = computed(() => {
  const result = {}

  selectGroupUsers.value.forEach(userName => {
    result[userName] = {}
    weeksRef.value.forEach((week, index) => {

      let currentWeekWorkloads = 0
      let count = 0

      allTask.value.forEach(task => {
        // 如果任务执行者不是当前选中的用户， 继续遍历下一个
        if (task.receiver_name !== userName) return

        if (!isTaskInWeek(week, task)) return
        // 计算当前任务在这一周内的总工作量
        const taskDuration = calWorkdays(task.start_time, task.deadline_time)
        const peerDayWorkload = task.workload / taskDuration
        const workdaysInWeek = getWorkdaysInWeek(week, task)
        const weekWorkload = peerDayWorkload * workdaysInWeek

        currentWeekWorkloads += weekWorkload
        count += 1
      })

      // 计算饱和度，防止除零错误
      const saturation = week.workday > 0 ? (currentWeekWorkloads / week.workday) * 100 : 0

      // 根据饱和度设置背景颜色
      let bgColor = '#eee'
      if (saturation > 0 && saturation < 100) {
        bgColor = 'rgb(94, 94, 214)'
      } else if (saturation >= 100 && saturation <= 110) {
        bgColor = 'green'
      } else if (saturation > 110 && saturation <= 120) {
        bgColor = 'orange'
      } else if (saturation > 120) {
        bgColor = 'rgb(129, 9, 9)'
      }

      result[userName][index] = {
        bgColor: bgColor,
        count: count,
        saturation: saturation.toFixed(2)
      }
      week[userName] = saturation.toFixed(2)
    })
  })
  console.log('result....................',result)

  return result
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
  emit('update:isLoading', true)
  emit('update:selectedUser', userName)
  emit('update:selectedWeek', '')
}

const changeUserWeekData = (userName, week) => {
  emit('update:isLoading', true)
  emit('update:selectedUser', userName)
  emit('update:selectedWeek', week)
}

const selectedAll = () => {
  emit('update:isLoading', true)
  emit('update:selectedUser', '')
  emit('update:selectedWeek', '')
}

// 日期信息计算属性
const dateInfo = computed({
  get() {
    return {
      year: props.selectedMonth[0],
      month: props.selectedMonth[1]
    }
  },
  set(value) {
    emit('update:selectedMonth', [value.year, value.month])
  }
})

// 月份导航方法
const prevMonth = () => {
  let [year, month] = props.selectedMonth
  if (month === 1) {
    year--
    month = 12
  } else {
    month--
  }
  emit('update:selectedMonth', [year, month])
}

const nextMonth = () => {
  let [year, month] = props.selectedMonth
  if (month === 12) {
    year++
    month = 1
  } else {
    month++
  }
  emit('update:selectedMonth', [year, month])
}

const goToday = () => {
  const today = new Date()
  emit('update:selectedMonth', [today.getFullYear(), today.getMonth() + 1])
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