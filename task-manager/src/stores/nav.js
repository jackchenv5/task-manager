import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useNavStore = defineStore('navigation', () => {
  const navItems = ref([
    { path: '/person', title: '我的任务',name:'person' },
    { path: '/group', title: '小组视图' ,name :'group'},
    { path: '/project', title: '项目视图',name :'project' },
    { path: '/schedule', title: '任务编排', name: 'schedule' },
    { path: '/search', title: '任务查询',name :'search' },
    { path: '/stat', title: '统计',name :'stat' },
    { path: '/system', title: '系统配置',name: 'system' }
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