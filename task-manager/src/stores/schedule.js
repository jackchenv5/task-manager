import { ref, computed } from 'vue'
import { defineStore,storeToRefs } from 'pinia'
import { getTaskDataApi } from '@/api/data/data'
import { useUserStore } from '@/stores/user'
const myUserStore = useUserStore()
const { loginUser } = storeToRefs(myUserStore)
export const useScheduleStore = defineStore('schedule', () => {

  // 首次加载，同步loginUser配置
  const schedule_config  = ref({
    'schedule_user_pool':null,
    'schedule_receiver':null,
    'schedule_select_user':null,
    'schedule_project_pool':null,

})
  // 一次加载所有关于schedule 的config
  const initScheduleConfig = () => {
    schedule_config.value.schedule_user_pool = useScheduleStore.getUserConfig('schedule_user_pool')
    schedule_config.value.schedule_receiver = useScheduleStore.getUserConfig('schedule_receiver')
    schedule_config.value.schedule_select_user = useScheduleStore.getUserConfig('schedule_select_user')
    schedule_config.value.schedule_project_pool = useScheduleStore.getUserConfig('schedule_project_pool')
  }

  const saveScheduleConfig = () => {
    useScheduleStore.setUserConfig('schedule_user_pool',schedule_config.value.schedule_user_pool)
    Object.entries(schedule_config.value).forEach(([key, value]) => {
      console.log(`Key: ${key}, Value: ${value}`);
      useScheduleStore.setUserConfig(key,value)
    });
}

  //人员池
  // 1. 数据都是原生的用户对象
  // 2. 
  const userPool = computed(() => schedule_config.value.schedule_user_pool)



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

  const curReceivers = computed(() => schedule_config.value.schedule_receiver)
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
  const curSelectUser =  computed(() => schedule_config.value.schedule_select_user)
  const curSelectUserInfo = computed( ()=>{
     return curSelectUser.value ? curReceivers.value.filter(x=>x.id === curSelectUser.value)[0] : {}
  })
  const curUserTasksRef = ref([])

  // 当前选中人员的任务总工时
  const curUserTasksWorkloadsRef = computed(() => {
    const allWorkloads = curUserTasksRef.value.reduce((sum, task) => sum + task.workload, 0);
    return allWorkloads
  })

  //当前选中日期的统计数据
const curSelectDateStat = ref({
  startDate:'',
  endDate:'',
  workloads:0,
  workNum:0,
  per:0,
})
// 跟新选中日期的统计数据
const updateSelectDateStat = (startDate,endDate,workloads,workNum,per) =>{
  curSelectDateStat.value.startDate = startDate
  curSelectDateStat.value.endDate = endDate
  curSelectDateStat.value.workloads = workloads
  curSelectDateStat.value.workNum = workNum
  curSelectDateStat.value.per = per

}
 // 基于原始数据的任务渲染数据
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


// table 数据
const schduleTableData = ref([])

// 获取schedule 表格数据
// 过滤项，1.自己创建的
// 2.最近100条数据

const getTableData = async () =>{
    console.log(loginUser.value,'======>')
    const curCreatorTasks = await getTaskDataApi({ creator: loginUser.value.id})
    schduleTableData.value = curCreatorTasks.result?.items
    console.log(schduleTableData.value)
}

// table 数据END

  // 当前选中人员任务 END

  //项目池
  const projectPool = ref([])

  // 当前要展示的任务数据

  const curTaskDetailRef = ref({})
  
  const updateCurTaskDetail = (taskObj) =>{
    curTaskDetailRef.value = taskObj
  }
  
  // 当前要展示的任务数据END

  return {
    curReceivers, curReceiverIDs, addToReceivers, deleteReceiverUser, clearReceivers, curSelectUser,curSelectUserInfo,
    userPool, userPoolIds, addToUserPool, deleteUserofPool, clearUserPool, getCurUserTasks,
    curUserTasksRef, curUserTasksWorkloadsRef,
    curUserScheduleTasksRef,updateSelectDateStat,
    curSelectDateStat,schduleTableData,getTableData,
    // 任务详情
    curTaskDetailRef,updateCurTaskDetail
  }
})