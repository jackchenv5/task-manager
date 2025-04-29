import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { getTaskDataApi } from '@/api/data/data'
export const useScheduleStore = defineStore('schedule', () => {

  // 首次加载，同步loginUser配置

  //人员池
  // 1. 数据都是原生的用户对象
  // 2. 
  const userPool = ref([])
  const userPoolIds = computed(() => userPool.value.length === 0 ? [] : userPool.value.map(x => x.id))

  const addToUserPool = (user) => {
    if (userPoolIds.value.includes(user.id)) return
    userPool.value.push(user)
  }

  const deleteUserofPool = (id) => {
    const idIndex = userPoolIds.value.indexOf(id)
    userPool.value.splice(idIndex, 1)
  }

  const clearUserPool = () => {
    userPool.value = []
  }
  // 人员池 END

  // 当前执行人员

  const curReceivers = ref([])

  // ✅ 计算属性，自动依赖跟踪
  const curReceiverIDs = computed(() => curReceivers.value.length === 0 ? [] : curReceivers.value.map(x => x.id));

  const addToReceivers = (user) => {
    if (curReceiverIDs.value.includes(user.id)) return
    curReceivers.value.push(user)
  }

  const deleteReceiverUser = (id) => {
    const idReceiverIndex = curReceiverIDs.value.indexOf(id)
    curReceivers.value.splice(idReceiverIndex, 1)
  }

  const clearReceivers = () => {
    curReceivers.value = []
  }

  // 当前执行人员 END

  // 当前选择人员
  const curSelectUser = ref()
  const curUserTasksRef = ref([])

  // 当前选中人员的原始任务数据
  const curUserTasksWorkloadsRef = computed(() => {
    const allWorkloads = curUserTasksRef.value.reduce((sum, task) => sum + task.workload, 0);
    return allWorkloads
  })

  const curUserScheduleTasksRef = computed(() => {
    return curUserTasksRef.value.map(x => {
      return { start_date: x.start_time, end_date: x.deadline_time, text: x.name, ...x }
    })
  })

  // 当前选中人员任务跟新
  const getCurUserTasks = async (id, start_time, deadline_time) => {
    const curUserTasks = await getTaskDataApi({ receiver: id, start_time: start_time, deadline_time: deadline_time })
    curUserTasksRef.value = curUserTasks.result.items.sort((a, b) => b.workload - a.workload)
  }

  // 当前选中人员任务 END

  //项目池
  const projectPool = ref([])

  return {
    curReceivers, curReceiverIDs, addToReceivers, deleteReceiverUser, clearReceivers, curSelectUser
    , userPool, userPoolIds, addToUserPool, deleteUserofPool, clearUserPool, getCurUserTasks,
    curUserTasksRef, curUserTasksWorkloadsRef,
    curUserScheduleTasksRef
  }
})