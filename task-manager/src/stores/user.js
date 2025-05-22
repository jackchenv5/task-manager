import { ref } from 'vue'
import { defineStore } from 'pinia'

// import { checkLogin } from '@/api/login/login'

import { saveConfig, getUserDetailApi, getUserByUsername,checkLogin } from '@/api/data/data'

export const useUserStore = defineStore('user', () => {
  const loginUser = ref({
    id: 1001,
    username: "李芬妮",
    emp_num: "007101",
    role: 0,
    role_name: '',
    group_leader: '',
    email: '',
    group: -1,
    group_name: '',
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

  const initUser = async (id) => {
    const curUserInfo = await getUserDetailApi(id);
    loginUser.value = curUserInfo
  }

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
    if (key) {
      return loginUser.value.config[key] ? loginUser.value.config[key] : defaultValue
    } else {
      return loginUser.value.config
    }

  }

  const saveUserConfig = async () => {
    const res = await saveConfig(loginUser.value.id, loginUser.value.config)
  }

  return { loginUser, checkLoginAndStore, getUserConfig, setUserConfig, initUser, saveUserConfig }
})