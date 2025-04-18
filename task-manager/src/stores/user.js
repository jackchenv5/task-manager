import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const loginUser = ref({
      id:1,
      username:"陈成F",
      emp_num:"007101",
      role:"发布者",
      config:{
        cur_group_status:"",
        user_pool: [
          { name: '张世伟', type: 'info' },
          { name: '陈成F', type: 'info' },
          { name: '乔志', type: 'info' },
          { name: '王俊坤', type: 'info' },
          { name: '乔志', type: 'info' },
        ],
        project_pool:["项目11111111111111111111111","项目22222222222222222222","项目33333333333333333333333333"],

      }
  })
  return { loginUser}
})