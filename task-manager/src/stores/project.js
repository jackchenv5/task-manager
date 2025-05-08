import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { getTaskDataApi } from '@/api/data/data'
import { useUserStore } from '@/stores/user'

import { reverseDateStr, percentToDecimal } from '@/utils/public'

const myUserStore = useUserStore()
const { loginUser } = storeToRefs(myUserStore)

export const useProjectStore = defineStore('project', () => {

  // 需要加载的配置
  const projectFocusRef = ref([
    'CP-V003R016C000_嵌入式软件平台智算网络快速收敛及设备健康度检查等关键技术研发',
    'RT-TT-2024-004_2025年路由器滚动版本项目',
    'SW-V010R002C002(PB069)_4U及1U高端数据中心交换机项目',
    'SW-V010R001C238_2024数据中心专项-重大入围支撑项目',
    'SW-V010R001C238_2024数据中心专项-重大入围支撑项目'
  ])

  const curSelectProjectRef = ref('')

  const curSelectProjectTasksRef = ref([])

  const selectUser = ref('')


 // 甘特数据格式化
const curGanttData = computed(() => {
  if (!curSelectProjectTasksRef.value?.length) return [];
  
  return curSelectProjectTasksRef.value.map(x => ({
    ...x,
    text: x.name,
    start_date: reverseDateStr(x.start_time),
    duration: x.diff_days,
    progress: percentToDecimal(x.progress)
  }));
});

// 参与人员分组
const curProjectReceiverMap = computed(() => {
  const retData = {};
  if (!curGanttData.value?.length) return retData;
  
  curGanttData.value.forEach(x => {
    if (x.receiver_name) {  // 确保receiver_name存在
      if (!retData[x.receiver_name]) {
        retData[x.receiver_name] = [];
      }
      retData[x.receiver_name].push(x);
    }
  });
  return retData;
});

// 参与人员列表
const joinUsers = computed(() => {
  return Object.keys(curProjectReceiverMap.value);
});

  watch(curSelectProjectRef, (newValue) => {
    updateCurSelectProjectTasks(curSelectProjectRef.value)
  })

  const updateCurSelectProjectTasks = async (project) => {
    const data = await getTaskDataApi({ project: project })

    const toSortItems = data.result?.items

    curSelectProjectTasksRef.value = toSortItems.sort((a, b) => {
      return new Date(a.start_time) - new Date(b.start_time);
    });
  }
  return {
    projectFocusRef, curSelectProjectRef, curGanttData, curProjectReceiverMap, selectUser, joinUsers
  }
})