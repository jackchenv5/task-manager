import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/public'
import { get } from '@/utils/httpData'

const myUserStore = useUserStore()

export const usePersonStore = defineStore('person', () => {
  const allTask = ref([]);
  const personCfg = myUserStore.getUserConfig("person") ? myUserStore.getUserConfig("person") : {}

  const  getPersonTasks = async (startDate,endDate) => {
    // 获取当前用户信息
    const curUserId = myUserStore.loginUser.id
    if (startDate === undefined && endDate === undefined) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      
      startDate = formatDate(firstDay);
      endDate = formatDate(lastDay);
    }
    // 根据用户id和起止时间获取后端的数据
    const url = "http://172.16.17.13:8010/api/tasks/"
    const params = {'receiver': curUserId, 'start_time': startDate, 'deadline_time': endDate}
    const response = await get(url, params)
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
    allTask.value = personTasks;
  }
  const feedbackTask = (id,feedInfo) =>{}
  return { allTask, personCfg, getPersonTasks, feedbackTask }
})