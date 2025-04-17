import { ref } from 'vue'
import { defineStore } from 'pinia'

import {getDataApi} from '@/api/data'
const  myPersionStore = usePersonStore()
export const usePersonStore = defineStore('person', () => {
  const curTasks = ref([])

  const  getPersonTasks = (startDate,endDate) => {
    myTasks = await getDataApi({startDate,endDate})
    console.log(myTasks)

  }
  const feedbackTask = (id,feedInfo) =>{}
  return { curTasks, getPersonTasks,feedbackTask }
})