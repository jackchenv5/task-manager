<template>
  <div style="display: flex; height: 90vh; width: 100%;">
    <div class="left">
      <Status v-model="typeRadio" :personCfg="personCfg" />
      <Calendar 
        ref="calendarRef"
        :tasks="myTotalTasks"
        @date-selected="handleDateSelected"
      />
      <TaskDetail 
        v-model:visible="showDetailPanel"
        :task="currentTask"
      />
    </div>
    
    <div class="right">
      <Summary :stats="stats" />
      <Tasks 
        :filtered-tasks="filteredTasks"
        @row-click="handleRowClick"
        @row-dblclick="handleRowDblClick"
        @feedback-submit="handleFeedbackSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePersonStore } from '@/stores/person'
import { useUserStore } from '@/stores/user'
import { formatVxeDate } from '@/utils/public'
import Status from './components/Status.vue'
import Calendar from './components/Calendar.vue'
import Summary from './components/Summary.vue'
import Tasks from './components/Tasks.vue'
import TaskDetail from './components/TaskDetail.vue'

const typeRadio = ref('all')
const showDetailPanel = ref(false)
const currentTask = ref({})
const calendarRef = ref(null)

const myPersonStore = usePersonStore()
const myUserStore = useUserStore()

const myTotalTasks = computed(() => myPersonStore.allTask)
const personCfg = computed(() => myUserStore.loginUser.config?.person || {})

const filteredTasks = computed(() => {
  let filtered = myTotalTasks.value.map(task => ({
    ...task,
    start_date: formatVxeDate(task.start_date),
    end_date: formatVxeDate(task.end_date)
  }))

  if (typeRadio.value !== 'all') {
    filtered = filtered.filter(event => {
      if (typeRadio.value === 'pending') return event.status_name === '待下发'
      if (typeRadio.value === 'running') return event.status_name === '进行中'
      if (typeRadio.value === 'done') return event.status_name === '已完成'
      return true
    })
  }
  return filtered
})

const stats = computed(() => {
  const filtered = filteredTasks.value
  const totalTasks = filtered.length
  const completedTasks = filtered.filter(t => t.status_name === '已完成').length
  const totalHours = filtered.reduce((sum, task) => sum + (task.workload * 8), 0)
  const totalWorkdays = filtered.reduce((sum, task) => sum + task.diff_days, 0)
  const saturation = (totalHours / (totalWorkdays * 8)) * 100
  const remainingHours = filtered.reduce((sum, task) => {
    if (task.status_name === '进行中') {
      const completed = task.workload * (parseFloat(task.progress) / 100)
      return sum + (task.workload * 8 - completed * 8)
    }
    return sum
  }, 0)

  return {
    totalTasks,
    completed: completedTasks,
    total: totalHours,
    remaining: Math.max(0, remainingHours),
    saturation: Math.min(100, Math.round(saturation))
  }
})

const handleRowClick = (row) => {
  if (row.status_name !== "进行中") {
    ElMessage.warning(`无法反馈该状态（${row.status_name}）的任务`)
    return
  }
}

const handleRowDblClick = (row) => {
  currentTask.value = row
  showDetailPanel.value = true
}

const handleDateSelected = (dates) => {
  // 处理日期选择逻辑
  console.log(dates)
}

const handleFeedbackSubmit = async (feedbackData) => {
  try {
    await myPersonStore.feedbackTask(feedbackData.taskId, {
      act_workload: feedbackData.actWorkload,
      progress: feedbackData.progress,
      feedback: feedbackData.info
    })
    ElMessage.success("反馈成功！")
  } catch (err) {
    ElMessage.error(`反馈失败：${err}`)
  }
}

onMounted(async () => {
  await myUserStore.initUser(608)
  await myPersonStore.getPersonTasks()
  console.log(myPersonStore.allTask)
  typeRadio.value = personCfg.value.typeRadio || "all"
})
</script>

<style>
@import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
.dhx_cal_data .dhx_month_body, 
.dhx_cal_data .dhx_month_head {
    height: 100% !important;
}

.dhx_cal_month_row {
  height: 100px !important;
}

.month_day_events {
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  font-size: 1.4em; 
  font-weight: bold;
  width: max-content;
}

.dhx_cal_event_line {
  display: none !important;
}

.highlighted {
    border: 2px solid #409EFF !important;
}

.highlight-row {
  background-color: #f0f7ff !important;
}

.highlight-row:hover > td {
  background-color: #e1f0ff !important;
}

.dhx_cal_month_cell {
  user-select: none;
}

.left, .right {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  background-color: white;
}
</style>