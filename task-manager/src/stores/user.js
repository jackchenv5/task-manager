import { ref } from 'vue'
import { defineStore } from 'pinia'

import { checkLogin } from '@/api/login/login'

import {saveConfig, getUserByUsername, getUserGroupApi} from '@/api/data/data'

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


  const hasPerm = async (userInfo) => {
      const perm = {person:true,group:false,schedule:false,search:true,system:false,stat:true}
      const allGroup = await getUserGroupApi()
      const groupLeaders = allGroup.map(x=>x.group_leader)
      const departLeaders = allGroup.map(x=>x.depart_leader)
      if( groupLeaders.includes(userInfo.username) || departLeaders.includes(userInfo.username) ||'管理人员' ===  userInfo.role_name ) {
        perm.group = true
      }

      if(['下发人员','编排人员','管理人员'].includes(userInfo.role_name)){
        perm.schedule = true
        perm.project = true
      }
      if(['下发人员',,'管理人员'].includes(userInfo.role_name)){
        perm.system =  true
      }
      return perm
  }


  const checkLoginAndStore = async () => {
    // 来自统一登陆接口 api
      // const loginInfo = await checkLogin()
      const loginInfo = {name:'陈成F'}
      // 获取用户数据

      if (loginInfo?.name) {
        const userInfo = await getUserByUsername(loginInfo.name)
          // const userInfo = await getUserByUsername("王金峰")
        const perm = await hasPerm(userInfo)
        loginUser.value = { ...userInfo,perm:perm }
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
      return defaultValue
    }

  }

  const saveUserConfig = async () => {
    const res = await saveConfig(loginUser.value.id, loginUser.value.config)
  }

  return { loginUser, checkLoginAndStore, getUserConfig, setUserConfig, saveUserConfig }
})
