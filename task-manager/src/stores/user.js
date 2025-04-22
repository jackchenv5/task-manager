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
    config: {}
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

  const setUserConfig = (key, value) => {
    loginUser.value.config[key] = value
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
    saveConfig(loginUser.value.id, loginUser.value.config)
  }

  return { loginUser, checkAndLogin, getUserConfig, setUserConfig, saveUserConfig }
})