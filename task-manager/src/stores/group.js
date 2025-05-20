import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/public'
import { getTaskDataApi, getUserGroupApi, taskPublishApi, taskModifyApi } from '@/api/data/data'

const myUserStore = useUserStore()


export const useGroupStore = defineStore('group', () => {
  const allTask = ref([])
  const allGroup = ref([])
  const groupCfg = ref({})
  const groupId = ref(-1)

  const  getAllTask = async (curGroupId,startDate,endDate) => {
    if (curGroupId === undefined) {
      if (groupId.value == -1) {
        groupId.value = myUserStore.loginUser.config.group.selectedGroupId ? myUserStore.loginUser.config.group.selectedGroupId : myUserStore.loginUser.group
      }
      curGroupId = groupId.value
    }
    if (startDate === undefined && endDate === undefined) {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      
      const firstDay = new Date(year, month - 1, 1)
      const lastDay = new Date(year, month, 0)
      
      startDate = formatDate(firstDay)
      endDate = formatDate(lastDay)
    }
    // 根据用户id和起止时间获取后端的数据
    const params = {'group': curGroupId, 'start_time': startDate, 'deadline_time': endDate}
    const response = await getTaskDataApi(params)
    // { id: 10001, text: 'Test1xxxxx', status: '进行中', start_date: '2025-02-01', end_date: '2025-02-03 23:59:59', hours: 28, project: '项目1xxxxxxx', tl: '朱元璋', worker: '张三', process: '30%', workdays: 1}
    let groupTasks = []
    response.result.items.forEach(e => {
        e.start_date = e.start_time
        e.end_date = e.deadline_time
        if (e.progress === null) {
          e.progress = '0'
        }
        groupTasks.push(e)
    })
    allTask.value = groupTasks
  };
  
  const  getAllGroup = async () => {
    // 获取所有组员信息数据
    const params = {}
    const response = await getUserGroupApi(params)
    allGroup.value = response.result.items
  }

  const getGroupCfg = async () => {
    // 获取用户组配置信息
    groupCfg.value = myUserStore.getUserConfig("group") ? myUserStore.getUserConfig("group") : {}
    if (!groupCfg.value.hasOwnProperty('selectedGroupId')) {
      groupCfg.value['selectedGroupId'] = myUserStore.loginUser.group
    }
    if (!groupCfg.value.hasOwnProperty('selectedStatus')) {
      groupCfg.value['selectedStatus'] = 'all'
    }

  }

  const setGroupCfg = (key, value) => {
    groupCfg.value[key] = value
    myUserStore.setUserConfig("group", groupCfg.value)
  }
  const dispatchTask = async (params) => {
    const res = await taskPublishApi(params)
    return res
  }
  const uploadAllChange = async (changeIndexs) => {
    
    const promises = changeIndexs.map(async (index) => {
      const newTask = allTask.value[index];
      const params = {start_time: newTask.start_date, deadline_time: newTask.end_date};
      
      try {
        const res = await taskModifyApi(newTask.id, params)
        return { success: true, name: newTask.name }
      } catch (error) {
        return { success: false, name: newTask.name, error }
      }
    });
    
    const results = await Promise.all(promises);
    const failMsg = results
      .filter(r => !r.success)
      .map(r => `任务 ${r.name} 更新失败: ${r.error.message}`)
      .join('\n')
    return failMsg
  }

  return { allTask, allGroup, groupCfg, groupId, getAllTask, dispatchTask, getAllGroup, getGroupCfg, setGroupCfg, uploadAllChange }
})