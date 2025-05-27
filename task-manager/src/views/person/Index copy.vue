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
import { formatVxeDate, getWorkdaysInMonth } from '@/utils/public'
import Status from './components/Status.vue'
import Calendar from './components/Calendar.vue'
import Summary from './components/Summary.vue'
import Tasks from './components/Tasks.vue'
import TaskDetail from './components/TaskDetail.vue'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

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

const selectedMonth = ref([new Date().getFullYear(), new Date().getMonth() + 1])
const selectedDates = ref([])

const stats = computed(() => {
  const filtered = filteredTasks.value
  const totalTasks = filtered.length
  const completedTasks = filtered.filter(t => t.status_name === '已完成').length
  const totalHours = filtered.reduce((sum, task) => sum + (task.workload * 8), 0)
  let saturation = 0
  if (selectedDates.value.length !== 0) {
    const totalWorkload = filtered.reduce((sum, task) => sum + (task.workload / task.diff_days), 0)
    saturation = (totalWorkload / selectedDates.value.length) * 100
  } else {
    const monthTotalWorkload = filtered.reduce((sum, task) => sum + task.workload, 0)
    const workdaysInMonth = getWorkdaysInMonth(selectedMonth)
    saturation = workdaysInMonth > 0 ? (monthTotalWorkload / workdaysInMonth) * 100 : 0
  }
  
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
    saturation: saturation
  }
})

const handleCheckDetail = (row) => {
  currentTask.value = row
  showDetailPanel.value = true
}

const handleDateSelected = (dates) => {
  // 处理日期选择逻辑
  selectedDates.value = dates.value
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
  // await myUserStore.initUser(608)
  await myPersonStore.getPersonTasks()
  typeRadio.value = personCfg.value.typeRadio || "all"

  // 启动引导程序
  if (!personCfg.value.guide) {
    driverObj.drive()
  }
})

// ---*--- 引导程序 ---*---
const driverObj = driver({
  showProgress: true,
  steps: [
    { element: '.el-radio-group', popover: { title: '状态选择', description: '选择对应状态过滤右边表格中的任务', side: "left", align: 'start' }},
    { element: '.dhx_cal_prev_button', popover: { title: '月份选择', description: '根据选择的月份渲染日历视图以及更新右边的任务', side: "left", align: 'start' }},
    { element: '.dhx_cal_data', popover: { title: '日历视图', description: '日历视图-动态渲染', side: "left", align: 'start' }},
    { element: '.month_day_total', popover: { title: '单日数据', description: '显示当日的 任务数 - 总工作量， 单击或者拖拽多选可查看多日的任务情况', side: "left", align: 'start' }},
    { element: '.task-summary', popover: { title: '任务总览', description: '显示过滤任务情况', side: "left", align: 'start' }},
    { element: '.vxe-table', popover: { title: '任务列表', description: '显示过滤后的任务列表', side: "left", align: 'start' }},
    { element: '.feedback-el-button', popover: { title: '反馈', description: '点击按钮反馈任务', side: "left", align: 'start' }},
    { element: '.check-el-button', popover: { title: '查看', description: '点击按钮查看任务详情', side: "left", align: 'start' }},
    { popover: { title: '恭喜', description: '您已完成当前页面所有引导，欢迎使用任务管理系统！', onNextClick: () => { handleTutorialComplete() } } }
  ]
});

const handleTutorialComplete = () => {
  personCfg.value.guide = true
  myUserStore.setUserConfig("person", personCfg.value)
  driverObj.destroy()
}
</script>

<style>
.el-link {
    font-size: 18px;
    margin-right: 20px;
    padding:10px;
  }

  .head {
    display: flex;
    justify-content: start;
    border-bottom: 2px solid #d6dfdf;
    border-top: 1px solid #f5f9f9;
    background: #ffffff;
  }

  .active{
    color: white;
    background: #5d6d96;
  }

.left, .right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  border: 1px solid #ccc;
  background-color: white;
}
.el-drawer__header {
    margin-bottom: 0
  }
</style>