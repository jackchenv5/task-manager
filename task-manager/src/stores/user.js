import { ref } from 'vue'
import { defineStore } from 'pinia'

import { checkLogin } from '@/api/login/login'

import { saveConfig } from '@/api/data/data'

export const useUserStore = defineStore('user', () => {
  const loginUser = ref({
    id: 608,
    username: "陈成F",
    emp_num: "007101",
    role: "发布者",
    config: {a:1,b:2}
  })

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

  // 更新值后,自动保存
  const setUserConfig = (key, value) => {
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

  //TODO 验证是否更新成功
  const saveUserConfig = async () => {
    saveConfig(loginUser.value.id, loginUser.value.config)
    
  }

  return { loginUser, checkAndLogin, getUserConfig, setUserConfig, saveUserConfig }
})