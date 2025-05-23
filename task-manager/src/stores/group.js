import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import { getFisrtAndLastDayOfMonth, getYearAndMonth,getWeeksInMonth } from '@/utils/public'
import { workLoadStat,groupWorkloadSaturation } from '@/utils/tasksStat'
import { getTaskDataApi, getUserGroupApi, taskPublishApi, taskModifyApi } from '@/api/data/data'
import { storeToRefs } from 'pinia'
const myUserStore = useUserStore()
const { loginUser } = storeToRefs(myUserStore)

export const useGroupStore = defineStore('group', () => {
  // 系统总组
  const allGroup = ref([])
  // 当前组配置
  const groupCfg = ref({})
  // 当前选中组
  const selectGroupID = ref(-1)

  const curSeletMonthDate = ref(new Date())

  const initSelectGroupID = () => {
    selectGroupID.value = loginUser.value.group
  }
  const updateGroupID = (id) => {
    selectGroupID.value = id
  }

  const selectGroup = computed(() => {
    return allGroup.value.find(item => item.id === selectGroupID.value)
  })

  const selectGroupCount = computed(() => {
    return selectGroup.value?.users?.length || 0 
  })

  const selectGroupUsers = computed(() => {
    console.log('user ............',selectGroup.value)
    return selectGroup.value?.users || []
  })

  const weeksRef = computed(() => {
    const [year, month] = getYearAndMonth(curSeletMonthDate.value)
    return getWeeksInMonth(year, month)
  })

  
  // 当前月份总任务
  const allTask = ref([])


  const initAllTask = async () => {
    // 登陆逻辑完成后， 用户登陆后就可以获取用户组ID
    const [start, end] = getFisrtAndLastDayOfMonth(curSeletMonthDate.value)
    const params = { 'group': selectGroupID.value, 'start_time': start, 'deadline_time': end }
    const response = await getTaskDataApi(params)
    allTask.value = response.result?.items ? response.result?.items : []
    console.log('allTask', allTask.value)
  };

  const groupStat = computed(() => {
    const stat = workLoadStat(allTask.value)
    console.log('stat ===========>',stat)
    return stat
  })

 const groupWorkloadSaturationRef = computed(() => {
  const [start, end] = getFisrtAndLastDayOfMonth(curSeletMonthDate.value,false)
    const stat = groupWorkloadSaturation(groupStat.value.total,selectGroupCount.value,start,end)
    console.log('stat ===========>',stat)
    return stat
  })
// 当前选中任务类型
const curTaskType = ref('all')


//  组方法
const initAllGroup = async () => {
  // 获取所有组员信息数据
  const params = {}
  const response = await getUserGroupApi()
  allGroup.value = response?.result?.items
  console.log('group init .........', allGroup.value)
}

// 计算属性
//  当前Table 数据
// 从allTak中筛选，用户 和 任务类型

const curTableData = computed(() => {
})
// 当前用户Gantt数据 
const curGanttData = computed(() => {
})


// 组配置保存
const initGroupCfg = async () => {
  // 获取用户组配置信息
  groupCfg.value = myUserStore.getUserConfig("group") ? myUserStore.getUserConfig("group") : {}
  console.log(groupCfg.value)
}

const setGroupCfg = (key, value) => {
  groupCfg.value[key] = value
  myUserStore.setUserConfig("group", groupCfg.value)
}

const init = async () => {
  await initAllGroup()
  await initGroupCfg()
  initSelectGroupID()
  await initAllTask()
}

return { 
  init, 
  allGroup, selectGroup, selectGroupID, updateGroupID,
  //任务数据
  allTask,
  // 统计数据
  groupStat,groupWorkloadSaturationRef,selectGroupUsers,
  //周 表数据
  curSeletMonthDate,weeksRef
}

})