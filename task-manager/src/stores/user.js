import { ref } from 'vue'
import { defineStore } from 'pinia'

// import { checkLogin } from '@/api/login/login'

import { saveConfig, getUserDetailApi, getUserByUsername,checkLogin } from '@/api/data/data'

export const useUserStore = defineStore('user', () => {
  const loginUser = ref({})

  // const initUser = async (id) => {
  //   const curUserInfo = await getUserDetailApi(id);
  //   loginUser.value = curUserInfo
  // }

  const login = () => {
    let loginURL = `${import.meta.env.VITE_LOGIN_URL}/login_for=${window.location.origin}`
    location.replace(loginURL);
  }

  const checkLoginAndStore = async () => {
    // 来自统一登陆接口 api
    const loginInfo = await checkLogin()
    // 获取用户数据

    if (loginInfo?.name) {
      const userInfo = await getUserByUsername(loginInfo.name)
      console.log('userInfo========>',userInfo)
      loginUser.value = { ...userInfo }

      // 将用户信息存储到localStorage（新增部分）
      try {
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      } catch (error) {
        console.error('存储用户信息失败:', error)
      }

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

  const getUserConfig = (key, defaultValue) => {
    if (key && loginUser.value.config  && (key in loginUser.value.config)) {
      return loginUser.value.config[key] ? loginUser.value.config[key] : defaultValue
    } else {
      return loginUser.value.config
    }

  }

  const saveUserConfig = async () => {
    const res = await saveConfig(loginUser.value.id, loginUser.value.config)
  }

  return { loginUser, checkLoginAndStore, getUserConfig, setUserConfig, saveUserConfig }
})