import { ref,computed } from 'vue'
import { defineStore } from 'pinia'

export const useScheduleStore = defineStore('schedule', () => {

  // 首次加载，同步loginUser配置
  
  //人员池
  // 1. 数据都是原生的用户对象
  // 2. 
  const userPool = ref([])
  const userPoolIds =  computed(()=> userPool.value.length === 0 ? [] : userPool.value.map(x => x.id)  ) 

  const addToUserPool = (user) => {
    if(userPoolIds.value.includes(user.id)) return
    userPool.value.push(user)
  }

  //项目池
  const projectPool = ref([])

  const curReceivers = ref([])
  
  // ✅ 计算属性，自动依赖跟踪
  const curReceiverIDs = computed(() => curReceivers.value.length === 0 ? [] : curReceivers.value.map(x => x.id));

  const addToReceivers = (user) => {
    if(curReceiverIDs.value.includes(user.id)) return
    curReceivers.value.push(user)
  }

  const curSelectUser=ref({
    username:"陈成F",
    workload:80,
    workload_per:"80%",
    select_start_date:"2025-04-14",
    select_end_date:"2025-04-18",
    tasks:[
      {
        creator:"陈成F",
        status: "",
        creator: "陈成F",
        name: "测试任务",
        start_time: "2024-04-14",
        deadline_time: "2024-04-18",
        workload: 8,
        receiver: "陈成F",
        sender: ["陈成F","乔志"] ,
        content: "工作内容",
        challenge: "挑战目标",
        project: "项目",
        related_task: "关联任务",
        description: "描述信息",
        act_workload: 0,
        progress: 80,
        feedback: "反馈信息" 
      },
      {
        creator:"陈成F",
        status: "",
        creator: "陈成F",
        name: "测试任务",
        start_time: "2024-04-14",
        deadline_time: "2024-04-18",
        workload: 8,
        receiver: "陈成F",
        sender: ["陈成F","乔志"] ,
        content: "工作内容",
        challenge: "挑战目标",
        project: "项目",
        related_task: "关联任务",
        description: "描述信息",
        act_workload: 0,
        progress: 80,
        feedback: "反馈信息" 
      },
      {
        creator:"陈成F",
        status: "",
        creator: "陈成F",
        name: "测试任务",
        start_time: "2024-04-14",
        deadline_time: "2024-04-18",
        workload: 8,
        receiver: "陈成F",
        sender: ["陈成F","乔志"] ,
        content: "工作内容",
        challenge: "挑战目标",
        project: "项目",
        related_task: "关联任务",
        description: "描述信息",
        act_workload: 0,
        progress: 80,
        feedback: "反馈信息" 
      }

    ]
  })
  return { curReceivers,curReceiverIDs, curSelectUser,userPool,userPoolIds,projectPool}
})