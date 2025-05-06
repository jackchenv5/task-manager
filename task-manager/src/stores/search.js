import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import { getTaskDataApi, getUserGroupApi, taskPublishApi } from '@/api/data/data'

const myUserStore = useUserStore()


export const useGroupStore = defineStore('group', () => {
  
  const  getAllGroup = async () => {
    // 获取所有组员信息数据
    const params = {};
    const response = await getUserGroupApi(params);
    return response.result.items;
  };

  return { getAllGroup }
})