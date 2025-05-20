<template>
  <div style="display: flex; height: 90vh; width: 100%;">
    <el-drawer
     v-model="isAdjustTasks"
      title="任务调整"
      direction="btt"
      size="100%"
      style="height: 100%"
     >
      <GanttChart 
        :users="users"
        :selectedMonth="selectedMonth"
      />
    </el-drawer>
    <div class="left">
      <Header 
        :groups="groups"
        v-model:selectedGroupId="selectedGroupId"
        v-model:selectedStatus="selectedStatus"
        :selectedMonth="selectedMonth"
        @update:groupSaturation="updateGroupSaturation"
      />
      <TaskOverview
        :users="users"
        :totalTasks="totalTasks"
        :selectedStatus="selectedStatus"
        :selectedMonth="selectedMonth"
        @update:selectedUser="childSelectedUser"
        @update:selectedWeek="childSelectedWeek"
        @update:isLoading="childIsLoading"
        @update:selectedMonth="childSelectedMonth"
       />
    </div>
    
    <div class="right">
      <Summary :stats="stats" />
      <TaskTable 
        :filteredTasks="filteredTasks" 
        :isLoading="isLoading" 
        :groups="groups"
        :selectedGroupId="selectedGroupId"
        @update:refreshGroup="refreshGroup"
        @update:adjustTasks="adjustTasks"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Header from './components/header.vue'
import TaskOverview from './components/TaskOverview.vue'
import Summary from './components/Summary.vue'
import TaskTable from './components/TaskTable.vue'
import GanttChart from './components/GanttChart.vue'
import { isTaskInWeek, formatDate, getWorkdaysInMonth } from '@/utils/public'
import { useGroupStore } from '@/stores/group'
import { useUserStore } from '@/stores/user'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const myGroupStore = useGroupStore()
const myUserStore = useUserStore()
const totalTasks = computed(() => myGroupStore.allTask)
const groups = computed(() => myGroupStore.allGroup)
const users = computed(() => {
  const group = groups.value.find(g => g.id === selectedGroupId.value)
  return group ? group.users : []
})

const filteredTasks = computed(() => {
  // 先根据 radio1 过滤状态
  let filtered = totalTasks.value
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(event => {
      if (selectedStatus.value === 'pending') return event.status_name === '待下发'
      if (selectedStatus.value === 'running') return event.status_name === '进行中'
      if (selectedStatus.value === 'done') return event.status_name === '已完成'
      return true;
    });
  }
  // 再根据 selectedUser 过滤
  if (selectedUser.value) {
    filtered = filtered.filter(event => 
      selectedUser.value == event.receiver_name
    )
  }
  // 再根据所选的周来过滤
  if (selectedWeek.value) {
    filtered = filtered.filter(event =>
      isTaskInWeek(selectedWeek.value, event)
    )
  }
  isLoading.value = false
  return filtered
});

// 初始化响应式数据： 组、任务状态、月份、选择的用户、以及对应的周
const selectedGroupId = ref(-1)
const selectedStatus = ref('all')
const selectedMonth = ref([new Date().getFullYear(), new Date().getMonth() + 1])
const selectedUser = ref('')
const selectedWeek = ref('')
const isLoading = ref(true)
const groupSaturation = ref(0)
const isAdjustTasks = ref(false)

// 获取子组件中修改后的值
const childSelectedUser = (newUser) => {
  selectedUser.value = newUser

}

const childSelectedWeek = (newWeek) => {
  selectedWeek.value = newWeek
  // selectedUser.value = newUser
}

const childIsLoading = (newVal) => {
  isLoading.value = newVal
}

const childSelectedMonth = (newVal) => {
  selectedMonth.value = newVal
  // 更新当前选择的月份的任务总数
  const [year, month] = newVal;
    
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
    
  const startDate = formatDate(firstDay);
  const endDate = formatDate(lastDay);
  
  myGroupStore.getAllTask(myGroupStore.groupCfg['selectedGroupId'], startDate, endDate);
}

const updateGroupSaturation = (newVal) => {
  groupSaturation.value = newVal
}

const refreshGroup = (newVal) => {
  myGroupStore.getAllTask(selectedGroupId.value)
}

const adjustTasks = (newVal) => {
  isAdjustTasks.value = true
}

// 观察记录当前用户的操作
watch(selectedGroupId, (newVal) => {
  myGroupStore.setGroupCfg('selectedGroupId', newVal)
  myGroupStore.getAllTask(newVal)
})

watch(selectedStatus, (newVal) => {
  myGroupStore.setGroupCfg('selectedStatus', newVal)
})

// 辅助函数：清理饱和度异常值
function sanitizeSaturation(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 0
  if (!isFinite(num)) return 0
  if (num < 0) return 0
  
  return num
}

// 任务统计信息
const stats = computed(() => {
  const filtered = filteredTasks.value
  const totalTasks = filtered.length
  const completedTasks = filtered.filter(t => t.status_name === '已完成').length
  const totalHours = filtered.reduce((sum, task) => sum + (task.workload * 8), 0)
  
  // 饱和度的计算方式： 
  //    - 如果selectedUser为空：所有任务的工作量之和 / 该组人员的总数 * 当月总工作日
  //    - 如果selectedUser不为空， selectedWeek为空： 这个人该月的任务的工作量之和 / 当月总工作日
  //    - 如果selectedUser不为空， selectedWeek不为空： 这个人该周的任务的工作量之和（周工作量为任务总工作量平摊到这一周的工作量） / 当周的共工作日
  let saturation = 0
  if (selectedUser.value != "" && selectedWeek.value != "") {
    saturation = parseFloat(selectedWeek.value[selectedUser.value]) || 0
  } else if (selectedUser.value != "" && selectedWeek.value == "") {
    const monthTotalWorkload = filtered.reduce((sum, task) => sum + task.workload, 0)
    const workdaysInMonth = getWorkdaysInMonth(selectedMonth)
    saturation = workdaysInMonth > 0 
      ? (monthTotalWorkload / workdaysInMonth) * 100 
      : 0
  } else if (groupSaturation.value) {
    saturation = parseFloat(groupSaturation.value) || 0
  }
  const remainingHours = filtered.reduce((sum, task) => {
    if (task.status_name === '进行中') {
      const completed = task.workload * (parseFloat(task.progress) / 100)
      return sum + (task.workload * 8 - completed * 8)
    }
    return sum
  }, 0)

  saturation = sanitizeSaturation(saturation)

  return {
    totalTasks,
    completed: completedTasks,
    total: totalHours,
    remaining: Math.max(0, remainingHours),
    saturation: saturation
  }
})

onMounted(async () => {
  // 根据userStores中存储的数据确定加载哪个组的数据
  // 初始化加载数据
  await myUserStore.initUser(427)
  await myGroupStore.getAllTask()
  await myGroupStore.getAllGroup()
  await myGroupStore.getGroupCfg()
  selectedGroupId.value = myGroupStore.groupCfg.selectedGroupId
  selectedStatus.value = myGroupStore.groupCfg.selectedStatus? myGroupStore.groupCfg.selectedStatus : 'all'
  // 计算当月的工作日天数
  selectedMonth.value = [new Date().getFullYear(), new Date().getMonth() + 1]

   // 启动引导程序
  if (!myGroupStore.groupCfg.guide) {
    driverObj.drive();
  }
});

// ---*--- 引导程序 ---*---
const driverObj = driver({
  showProgress: true,
  steps: [
    { element: '.group-summary', popover: { title: '小组选择', description: '选择小组查看任务情况， 默认当前用户所在小组', side: "left", align: 'start' }},
    { element: '.el-radio-group', popover: { title: '任务状态选择', description: '根据状态过滤右边任务列表', side: "left", align: 'start' }},
    { element: '.export-excel-el-button', popover: { title: '导出数据', description: '导出当前小组任务数据', side: "left", align: 'start' }},
    { element: '.allSelect-el-button', popover: { title: '全选', description: '清空当前人员或者周任务选择', side: "left", align: 'start' }},
    { element: '.month-selected-button', popover: { title: '切换月份', description: '切换月份会重新渲染日历和更新右边的任务列表', side: "left", align: 'start' }},
    { element: '.table-body', popover: { title: '任务总览', description: '显示当前月小组成员每一周的工作量', side: "left", align: 'start' }},
    { element: '.table-row', popover: { title: '成员详情', description: '点击成员或者某一周可以查看具体详情， 每一周表格中显示任务总数和饱和度', side: "left", align: 'start' }},
    { element: '.task-summary', popover: { title: '任务汇总', description: '显示过滤任务情况', side: "left", align: 'start' }},
    { element: '.vxe-table', popover: { title: '任务列表', description: '显示过滤任务', side: "left", align: 'start' }},
    { element: '.col_11', popover: { title: '编辑', description: '点击下列操作栏中的编辑按钮编辑任务', side: "left", align: 'start' }},
    { element: '.dispatchTask-el-button', popover: { title: '下发任务', description: '先选择下列表格中的任务， 点击自动下发待下发状态的任务', side: "left", align: 'start' }},
    { element: '.adjustTask-el-button', popover: { title: '调整任务', description: '使用甘特图的方式调整任务', side: "left", align: 'start' }},
    { popover: { title: '恭喜', description: '您已完成当前页面所有引导，欢迎使用任务管理系统！', onNextClick: () => { handleTutorialComplete() } } }
  ]
});

const handleTutorialComplete = () => {
  myGroupStore.groupCfg.guide = true
  myUserStore.setUserConfig("group", myGroupStore.groupCfg)
  driverObj.destroy()
}

</script>

<style scoped>
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
:deep(.el-drawer__header) {
  margin-bottom: 0 !important;
}
</style>