import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { getTaskDataApi } from '@/api/data/data'
import { useUserStore } from '@/stores/user'

import { reverseDateStr, percentToDecimal, TaskStatus } from '@/utils/public'

const myUserStore = useUserStore()
const { loginUser } = storeToRefs(myUserStore)
export const useScheduleStore = defineStore('schedule', () => {

  // 需要加载的配置
  const userPool = ref([])
  const curReceivers = ref([])
  const curSelectUser = ref()
  const projectPool = ref([])
  const lastAddTasksRef = ref([])
  const curSelectProjectRef = ref('')

  const updateLastAddTaks = (tasks) =>{
    lastAddTasksRef.value = tasks
  }
  //
  // 首次加载，同步loginUser配置
  // project 更新
  const addToProjectPool = (project) => {
    if (projectPool.value.includes(project)) return
    projectPool.value.push(project)
    saveScheduleConfig()
  }

  
  const deleteProjectInPool = (project) => {
      const index = projectPool.value.indexOf(project);
      projectPool.value.splice(index,1);
      saveScheduleConfig()
  }

  const cleanProjectPool = () => {
     projectPool.value = []
     saveScheduleConfig()
  }

  // 一次加载所有关于schedule 的config
  const initScheduleConfig = () => {
    userPool.value = myUserStore.getUserConfig('schedule_user_pool', [])
    projectPool.value = myUserStore.getUserConfig('schedule_project_pool', [])
  }

  const saveScheduleConfig = () => {
    myUserStore.setUserConfig('schedule_user_pool', userPool.value)
    myUserStore.setUserConfig('schedule_project_pool', projectPool.value)
  }

  // 人员池
  const userPoolIds = computed(() => userPool.value.length === 0 ? [] : userPool.value.map(x => x.id))

  const addToUserPool = (user) => {
    if (userPoolIds.value.includes(user.id)) return
    userPool.value.push(user)
    saveScheduleConfig()
  }

  const deleteUserofPool = (id) => {
    const idIndex = userPoolIds.value.indexOf(id)
    userPool.value.splice(idIndex, 1)
    saveScheduleConfig()
  }

  const clearUserPool = () => {
    userPool.value = []
  }
  // 人员池 END

  // 当前执行人员


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

  const curSelectUserInfo = computed(() => {
    return curSelectUser.value ? curReceivers.value.filter(x => x.id === curSelectUser.value)[0] : {}
  })
  const curUserTasksRef = ref([])

  // 当前选中人员的任务总工时
  const curUserTasksWorkloadsRef = computed(() => {
    const allWorkloads = curUserTasksRef.value.reduce((sum, task) => sum + task.workload, 0);
    return allWorkloads
  })

  //当前选中日期的统计数据
  const curSelectDateStat = ref({
    startDate: '',
    endDate: '',
    workloads: 0,
    workNum: 0,
    per: 0,
  })
  // 跟新选中日期的统计数据
  const updateSelectDateStat = (startDate, endDate, workloads, workNum, per) => {
    curSelectDateStat.value.startDate = startDate
    curSelectDateStat.value.endDate = endDate
    curSelectDateStat.value.workloads = workloads
    curSelectDateStat.value.workNum = workNum
    curSelectDateStat.value.per = per

  }
  // 基于原始数据的任务渲染数据
  const curUserScheduleTasksRef = computed(() => {
    return curUserTasksRef.value.map(x => {
      return { start_date: x.start_time, end_date: `${x.deadline_time} 23:59:59`, text: x.name, ...x }
    })
  })

  // 当前选中人员任务跟新
  const getCurUserTasks = async (id, start_time, deadline_time) => {
    const curUserTasks = await getTaskDataApi({ receiver: id, start_time: start_time, deadline_time: deadline_time })
    curUserTasksRef.value = curUserTasks.result.items.sort((a, b) => b.workload - a.workload)
  }


  // table 数据 ==> gantt 图数据
  const schduleTableData = ref([])

  // 获取schedule 表格数据
  // 过滤项，1.自己创建的
  // 2.最近100条数据

  const getTableData = async () => {
    const curCreatorTasks = await getTaskDataApi({ creator: loginUser.value.id })
    if (curSelectUser.value) getCurUserTasks(curSelectUser.value)
    schduleTableData.value = curCreatorTasks.result?.items.sort((a, b) => {
      return new Date(a.start_time) - new Date(b.start_time);
    });
  }


  // 当前执行中的任务
  const curPendGanttData = computed(() => {
    if (!schduleTableData.value?.length) return [];

    return schduleTableData.value.filter(x=> x.status == TaskStatus.PEND).map(x => ({
      ...x,
      text: x.name,
      start_date: reverseDateStr(x.start_time),
      duration: x.diff_days,
      progress: percentToDecimal(x.progress)
    }));
  });
  

  // table 数据END

  // 当前选中人员任务 END

  //项目池


  // 当前要展示的任务数据

  const curTaskDetailRef = ref({})

  const updateCurTaskDetail = (taskObj) => {
    curTaskDetailRef.value = taskObj
  }

  // 当前要展示的任务数据END
  const curPendTasksLength = computed(()=>curPendGanttData.value.length)
  const lastPendTasksLength = computed(() => lastAddTasksRef.value.length);


  return {
    curReceivers, curReceiverIDs, addToReceivers, deleteReceiverUser, clearReceivers, curSelectUser, curSelectUserInfo,
    userPool, userPoolIds, addToUserPool, deleteUserofPool, clearUserPool, getCurUserTasks,
    curUserTasksRef, curUserTasksWorkloadsRef,
    curUserScheduleTasksRef, updateSelectDateStat,
    curSelectDateStat, schduleTableData, getTableData,
    //项目池
    projectPool, curSelectProjectRef,addToProjectPool,deleteProjectInPool,cleanProjectPool,
    // 任务详情
    curTaskDetailRef, updateCurTaskDetail,
    //
    initScheduleConfig, saveScheduleConfig,
    // 甘特数据
    curPendGanttData,curPendTasksLength,
    // 最近添加的任务
    updateLastAddTaks,lastAddTasksRef,lastPendTasksLength
  }
})