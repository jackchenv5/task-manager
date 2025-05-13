<template>
  <div style="display: flex; height: 90vh; width: 100%;">
    <div class="left">
      <Status v-model="typeRadio" :personCfg="personCfg" />
      <Calendar 
        ref="calendarRef"
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
        @checkDetail="handleCheckDetail"
        @feedback-submit="handleFeedbackSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
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

const handleCheckDetail = (row) => {
  currentTask.value = row
  showDetailPanel.value = true
}

const handleDateSelected = (dates) => {
  // 处理日期选择逻辑
  console.log(dates, dates.value)
  const allEvents = [];
  dates.value.forEach(dateStr => {
    const date = new Date(dateStr);
    const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"));
    allEvents.push(...events);
  });
  
  myPersonStore.allTask = Array.from(new Map(allEvents.map(event => [event.id, event])).values());
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
.el-drawer__header {
    margin-bottom: 0
  }
</style>