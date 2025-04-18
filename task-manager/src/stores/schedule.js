import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useScheduleStore = defineStore('schedule', () => {
  const curReceivers = ref([{ name: '张世伟', type: 'info' },{ name: '陈成F', type: 'info' },])
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
  return { curReceivers, curSelectUser}
})