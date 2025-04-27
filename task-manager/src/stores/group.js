import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/public'
import { get } from '@/utils/httpData'

const myUserStore = useUserStore()


export const useGroupStore = defineStore('group', () => {
  const allTask = ref([]);
  const allGroup = ref([]);
  const groupCfg = ref({});
  const groupId = myUserStore.loginUser.config.selectedGroupId ? myUserStore.loginUser.config.selectedGroupId : myUserStore.loginUser.groupId;

  const  getAllTask = async (curGroupId,startDate,endDate) => {
    if (startDate === undefined && endDate === undefined) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      
      startDate = formatDate(firstDay);
      endDate = formatDate(lastDay);
    }
    // 根据用户id和起止时间获取后端的数据
    const url = "http://172.16.17.13:8010/api/tasks/"
    const params = {'group': curGroupId, 'start_time': startDate, 'deadline_time': endDate}
    const response = await get(url, params)
    // { id: 10001, text: 'Test1xxxxx', status: '进行中', start_date: '2025-02-01', end_date: '2025-02-03 23:59:59', hours: 28, project: '项目1xxxxxxx', tl: '朱元璋', worker: '张三', process: '30%', workdays: 1}
    let groupTasks = [];
    response.result.items.forEach(e => {
        e.start_date = e.start_time;
        e.end_date = e.deadline_time + " 23:59:59";
        if (e.progress === null) {
          e.progress = '0';
        }
        groupTasks.push(e);
    });
    allTask.value = groupTasks;
  };
  
  const  getAllGroup = async () => {
    // 获取所有组员信息数据
    const url = "http://172.16.17.13:8010/api/groups/";
    const params = {};
    const response = await get(url, params);
    allGroup.value = response.result.items;
  };

  const getGroupCfg = () => {
    // 获取用户组配置信息
    groupCfg.value = myUserStore.getUserConfig("group") ? myUserStore.getUserConfig("group") : {};
    if (!groupCfg.value.hasOwnProperty('selectedGroupId')) {
      groupCfg.value['selectedGroupId'] = myUserStore.loginUser.groupId
    }
    if (!groupCfg.value.hasOwnProperty('selectedGroup')) {
      groupCfg.value['selectedGroup'] = myUserStore.loginUser.groupName
    }
    if (!groupCfg.value.hasOwnProperty('radio')) {
      groupCfg.value['radio'] = 'all'
    }
    if (!groupCfg.value.hasOwnProperty('checkedMembers')) {
      const group = allGroup.value.find(g => g.name === groupCfg.value.selectedGroup);
      groupCfg.value['checkedMembers'] = group ? group.users : []
    }
    if (!groupCfg.value.hasOwnProperty('selectedProjects')) {
      const projectsForMembers = allTask.value
        .filter(task => groupCfg.value.checkedMembers.includes(task.receiver_name))
        .map(task => task.project);
      groupCfg.value['selectedProjects'] = [...new Set(projectsForMembers)]
    }
    if (!groupCfg.value.hasOwnProperty('switchButtonValue')) {
      groupCfg.value['switchButtonValue'] = true
    }

  }

  const feedbackTask = (id,feedInfo) =>{}
  const dispatchTask = (id) => {}
  return { allTask, allGroup, groupCfg, groupId, getAllTask, feedbackTask, dispatchTask, getAllGroup, getGroupCfg }
})