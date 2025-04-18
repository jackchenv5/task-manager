import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import { getUserDataApi } from '@/api/data/data'

export const usePersonStore = defineStore('person', () => {
  const curTasks = ref([])

  const  getPersonTasks = (startDate,endDate) => {
    const myUserStore = useUserStore();
    const userId = myUserStore.loginUser.id
    console.log(userId);
    const params = {receiver: userId, start_time: startDate, deadline_time: endDate}
    const result = await getUserDataApi(params);
    console.log(result);
    curTasks.value = result;
  }
  const feedbackTask = (id,feedInfo) =>{}
  return { curTasks, getPersonTasks,feedbackTask }
})