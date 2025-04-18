import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import { getUserDataApi } from '@/api/data/data'

<<<<<<< HEAD
=======
import {getDataApi} from '@/api/data'
const  myPersionStore = usePersonStore()
>>>>>>> 4be720b98875c02294b530902ce309bd0e0378b9
export const usePersonStore = defineStore('person', () => {
  const curTasks = ref([])

  const  getPersonTasks = (startDate,endDate) => {
<<<<<<< HEAD
    const myUserStore = useUserStore();
    const userId = myUserStore.loginUser.id
    console.log(userId);
    const params = {receiver: userId, start_time: startDate, deadline_time: endDate}
    const result = await getUserDataApi(params);
    console.log(result);
    curTasks.value = result;
=======
    myTasks = await getDataApi({startDate,endDate})
    console.log(myTasks)

>>>>>>> 4be720b98875c02294b530902ce309bd0e0378b9
  }
  const feedbackTask = (id,feedInfo) =>{}
  return { curTasks, getPersonTasks,feedbackTask }
})