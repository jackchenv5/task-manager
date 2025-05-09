import { ref } from 'vue'
import { defineStore } from 'pinia'

import { checkLogin } from '@/api/login/login'

import { saveConfig,getUserDetailApi } from '@/api/data/data'

export const useUserStore = defineStore('user', () => {
  const loginUser = ref({
    "id": 608,
    "username": "陈成F",
    "emp_num": "007101",
    "role": 141,
    "email": "chenchengf@rd.maipu.com",
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

  const getUserConfig = (key,defalut='') => {
    console.log('=============get config',key,loginUser.value.config)
    if(key){
      // 有此属性配置，直接返回
      if(loginUser.value.config.hasOwnProperty(key)){
        return loginUser.value.config[key]
      }
      // 没有此属性，创建属性，并赋值null
      loginUser.value.config[key] = defalut
      return defalut
    }else{
      return loginUser.value.config
    }
    
  }

  const saveUserConfig = async () => {
    const res = await saveConfig(loginUser.value.id, loginUser.value.config)
    console.log('save config res: ', res);
  }

  return { loginUser, checkAndLogin, getUserConfig, setUserConfig, initUser,  saveUserConfig }
})