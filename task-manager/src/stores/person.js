import { ref,computed,watch } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import { formatDate,getFisrtAndLastDayOfMonth } from '@/utils/public'
import {workLoadStat,groupWorkloadSaturation} from '@/utils/tasksStat'
import { taskModifyApi, getTaskDataApi } from '@/api/data/data'

import { TaskStatus } from '@/constants/public'
const myUserStore = useUserStore()

export const usePersonStore = defineStore('person', () => {
  const allTask = ref([]);
  const curTaskType = ref(TaskStatus.ALL)

  const curSeletMonthDate = ref(new Date())
  const stat = computed(()=>{
      const ret =  workLoadStat(allTask.value)
      console.log('stat ===========>',ret)
      return ret
  })
  const workloadSaturation = computed(() => {
    const [start, end] = getFisrtAndLastDayOfMonth(curSeletMonthDate.value, false)

    const saturation = groupWorkloadSaturation(stat.value.total, stat.length , start, end)
    return saturation
  })
  const filteredTasks = computed(()=>{
      if (TaskStatus.ALL === curTaskType.value) return allTask.value
      return allTask.value.filter(item =>{
        return item.status === curTaskType.value 
      } )
  })

  const personCfg = myUserStore.getUserConfig("person") ? myUserStore.getUserConfig("person") : {}
  const changeMonthDate = (date) => {
      curSeletMonthDate.value = date
      curTaskType.value =  TaskStatus.ALL
  }

  watch(curSeletMonthDate, () => {
    getPersonTasks()
  })
  const  getPersonTasks = async () => {
    // 获取当前用户信息
    const [start, end] = getFisrtAndLastDayOfMonth(curSeletMonthDate.value)
    // 根据用户id和起止时间获取后端的数据
    const params = {'receiver': myUserStore.loginUser.id, 'start_time': start, 'deadline_time': end}
    const response = await getTaskDataApi(params)
    // { id: 10001, text: 'Test1xxxxx', status: '进行中', start_date: '2025-02-01', end_date: '2025-02-03 23:59:59', hours: 28, project: '项目1xxxxxxx', tl: '朱元璋', worker: '张三', process: '30%', workdays: 1}
    let personTasks = [];
    response.result.items.forEach(e => {
        e.start_date = e.start_time;
        e.end_date = e.deadline_time + " 23:59:59";
        if (e.progress === null) {
          e.progress = '0';
        }
        personTasks.push(e);
    });
    console.log(personTasks)
    allTask.value = personTasks;
  }
  const feedbackTask = async (id, feedInfo) =>{
    const res = await taskModifyApi(id, feedInfo);
    return res;
  }

  const init = async () => {
    await getPersonTasks()
  }

  return { 
    init,
    // 当前选中月
    curSeletMonthDate,changeMonthDate,
    // 统计数据
    stat,workloadSaturation,
    curTaskType,allTask,filteredTasks,
     personCfg, getPersonTasks, feedbackTask 
  }
})