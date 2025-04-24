import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useGroupStore = defineStore('group', () => {
  const allTask = ref([])

  const  getAllTask = (startDate,endDate) => {
    if (startDate === '2025-02-01') {
      allTask.value = [
        { id: 10001, text: 'Test1xxxxx', status: '进行中', start_date: '2025-02-01', end_date: '2025-02-03 23:59:59', hours: 28, project: '项目1xxxxxxx', tl: '朱元璋', worker: '张三', process: '30%', workdays: 1},
        { id: 10002, text: 'Test2', status: '进行中', start_date: '2025-02-03', end_date: '2025-02-05 23:59:59', hours: 21, project: '项目2', tl: '朱标', worker: '李四', process: '0%', workdays: 3 },
        { id: 10003, text: 'Test3', status: '待下发', start_date: '2025-02-05', end_date: '2025-02-08 23:59:59', hours: 30, project: '项目3', tl: '朱允炆', worker: '王五', process: '0%', workdays: 3 },
        { id: 10004, text: 'Test4', status: '已完成', start_date: '2025-02-08', end_date: '2025-02-15 23:59:59', hours: 42, project: '项目4', tl: '朱厚熜', worker: '诸葛亮', process: '100%', workdays: 6 },
        { id: 10005, text: 'Test5', status: '已完成', start_date: '2025-02-15', end_date: '2025-02-28 23:59:59', hours: 80, project: '项目5', tl: '朱由检', worker: '孙权', process: '100%', workdays: 10 }
      ]
    } else if (startDate === '2025-03-01') {
      allTask.value = [
        { id: 10006, text: 'Test6', status: '已完成', start_date: '2025-03-01', end_date: '2025-03-03 23:59:59', hours: 28, project: '项目1xxxxxxx', tl: '朱元璋', worker: '张三', process: '100%', workdays: 1},
        { id: 10007, text: 'Test7', status: '进行中', start_date: '2025-03-04', end_date: '2025-03-15 23:59:59', hours: 21, project: '项目2', tl: '朱标', worker: '李四', process: '0%', workdays: 7 },
        { id: 10008, text: 'Test8', status: '待下发', start_date: '2025-03-16', end_date: '2025-03-21 23:59:59', hours: 30, project: '项目3', tl: '朱允炆', worker: '王五', process: '0%', workdays: 5 },
        { id: 10009, text: 'Test9', status: '进行中', start_date: '2025-03-15', end_date: '2025-03-22 23:59:59', hours: 42, project: '项目4', tl: '朱厚熜', worker: '诸葛亮', process: '50%', workdays: 5 },
        { id: 10010, text: 'Test10', status: '已完成', start_date: '2025-03-13', end_date: '2025-03-31 23:59:59', hours: 80, project: '项目5', tl: '朱由检', worker: '孙权', process: '100%', workdays: 6 }
      ]
    } else if (startDate === '2025-04-01') {
      allTask.value = [
        { id: 10011, text: 'Test11', status: '待下发', start_date: '2025-04-01', end_date: '2025-04-15 23:59:59', hours: 120, project: '项目1xxxxxxx', tl: '朱元璋', worker: '张三', process: '0%', workdays: 11},
        { id: 10012, text: 'Test12', status: '进行中', start_date: '2025-04-01', end_date: '2025-04-12 23:59:59', hours: 80, project: '项目2', tl: '朱标', worker: '李四', process: '0%', workdays: 9 },
        { id: 10013, text: 'Test13', status: '待下发', start_date: '2025-04-16', end_date: '2025-04-22 23:59:59', hours: 90, project: '项目3', tl: '朱允炆', worker: '王五', process: '0%', workdays: 5 },
        { id: 10014, text: 'Test14', status: '进行中', start_date: '2025-04-20', end_date: '2025-04-28 23:59:59', hours: 100, project: '项目4', tl: '朱厚熜', worker: '诸葛亮', process: '20%', workdays: 6 },
        { id: 10015, text: 'Test15', status: '已完成', start_date: '2025-04-20', end_date: '2025-04-30 23:59:59', hours: 110, project: '项目5', tl: '朱由检', worker: '孙权', process: '100%', workdays: 8 }
      ]
    } else {
      allTask.value = []
    }

  };
  const feedbackTask = (id,feedInfo) =>{}
  const dispatchTask = (id) => {}
  return { allTask, getAllTask, feedbackTask, dispatchTask }
})