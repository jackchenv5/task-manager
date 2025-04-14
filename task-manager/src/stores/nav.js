import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useNavStore = defineStore('navigation', () => {
  const navItems = ref([
    { path: '/person', title: '我的任务' },
    { path: '/group', title: '小组视图' },
    { path: '/project', title: '项目视图' },
    { path: '/schedule', title: '任务编排' },
    { path: '/system', title: '系统配置' }
  ])

  const  updateTitle = (index, newTitle) => {
    navItems.value[index].title = newTitle
  }
    // 定义操作方法（相当于 Options API 的 actions）
  const addNavItem = (item) => {
      navItems.value.push(item)
    }

  return { navItems, updateTitle,addNavItem }
})