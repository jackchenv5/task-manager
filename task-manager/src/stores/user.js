import { ref } from 'vue'
import { defineStore } from 'pinia'

import { checkLogin } from '@/api/login/login'

import { saveConfig,getUserDetailApi } from '@/api/data/data'

export const useUserStore = defineStore('user', () => {
  const loginUser = ref({
    id: 1001,
    username: "陈菁菁",
    emp_num: "007101",
    role:0,
    role_name:'',
    group_leader:'',
    email:'',
    group:-1,
    group_name:'',
    role: "发布者",
    groupId: 6,
    groupName: "业务测试处-协议测试组",
    config: {}
    // config: {"group": {"selectedGroup": "武汉测试处-产品组",
    //                    "radio": "pending", 
    //                    "checkedMembers": ["刘兵"], 
    //                    "selectedProjects": ["RT-TT-2024-004_2025年路由器滚动版本项目"],
    //                    "selectedGroupId": 25},
    //          "person": {"typeRadio": "pending"},
    //     }
  })

  const initUser = async (id) =>{
      const curUserInfo = await getUserDetailApi(id);
      console.log(curUserInfo);
      loginUser.value = curUserInfo
  }

  const login = () => {
    let loginURL = `${import.meta.env.VITE_LOGIN_URL}/login_for=${window.location.origin}`
    location.replace(loginURL);
  }

  const checkAndLogin = async () => {
    const userInfo = await checkLogin()
    if (userInfo.status) {
      loginUser.value = { ...userInfo }
    } else {
      login();
    }
    return true
  }

  const setUserConfig = (key, value) => {
    //TODO 增加保存结果判断
    loginUser.value.config[key] = value
    saveUserConfig()
    return true
  }

  const getUserConfig = (key) => {
    if(key){
      return loginUser.value.config[key]
    }else{
      return loginUser.value.config
    }
    
  }

  const saveUserConfig = async () => {
    console.log(loginUser.value.config);
    const res = await saveConfig(loginUser.value.id, loginUser.value.config)
    console.log('save config res: ', res);
  }

  return { loginUser, checkAndLogin, getUserConfig, setUserConfig, initUser,  saveUserConfig }
})