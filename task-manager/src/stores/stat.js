import { ref } from 'vue'
import { defineStore } from 'pinia'
import { StatType } from '@/constants/public.js'

export const useNavStore = defineStore('stat', () => {
  const supportedStats = ref([
    { name: '编排精准度指标', value: StatType.TASK_SATURATION },
    // { name: '任务工作量', value: StatType.TASK_WORKLOAD },
    // { name: '项目进度', value: StatType.PROJECT_PROGRESS },
  ])
  const selectedStat = ref([])
  const updateSelectedStat = (stat) => {
    selectedStat.value = stat
  }
  return {
    supportedStats,
    selectedStat,
    updateSelectedStat
  }

})