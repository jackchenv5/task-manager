import { ref } from 'vue'
import { defineStore } from 'pinia'

import {getDataApi} from '@/api/data/data'
export const useUserStore = defineStore('user', () => {
  const loginUser = ref({
      id:1,
      username:"陈成F",
      emp_num:"007101",
      role:"发布者",
      config:{
        user_pool:["陈成F"],
        project_pool:[],

      }
  })

  const curSelectUser=ref({
    username:"陈成F",
    workload:80,
    workload_per:"80%",
    select_start_date:"2025-04-14",
    select_end_date:"2025-04-18",
    tasks:[]
  })
  return { loginUser, curSelectUser }
})
