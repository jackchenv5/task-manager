import { ref } from 'vue'
import { defineStore } from 'pinia'

const  myPersionStore = usePersonStore()
export const usePersonStore = defineStore('person', () => {
  const curTasks = ref([])

  const  getPersonTasks = (startDate,endDate) => {}
  const feedbackTask = (id,feedInfo) =>{}
  return { curTasks, getPersonTasks,feedbackTask }
})