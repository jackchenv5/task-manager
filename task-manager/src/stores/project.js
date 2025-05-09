import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { getTaskDataApi } from '@/api/data/data'
import { useUserStore } from '@/stores/user'

import { reverseDateStr, percentToDecimal, TaskStatus } from '@/utils/public'

const myUserStore = useUserStore()
const { loginUser } = storeToRefs(myUserStore)

export const useProjectStore = defineStore('project', () => {

  // 需要加载的配置
  const projectFocusRef = ref([
    'CP-V003R016C000_嵌入式软件平台智算网络快速收敛及设备健康度检查等关键技术研发',
    'SW-V010R002C004(PB073)_信创智能无损TOR交换机产品研发',
    'RT-TT-2024-004_2025年路由器滚动版本项目',
    'SW-V010R002C002(PB069)_4U及1U高端数据中心交换机项目',
    'SW-V010R001C238_2024数据中心专项-重大入围支撑项目'
  ])

  const curSelectProjectRef = ref('SW-V010R002C004(PB073)_信创智能无损TOR交换机产品研发')

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
    updateCurSelectProjectTasks()
  })

  const updateCurSelectProjectTasks = async () => {
    const data = await getTaskDataApi({ project: curSelectProjectRef.value })

    const toSortItems = data.result?.items

    curSelectProjectTasksRef.value = toSortItems.sort((a, b) => {
      return new Date(a.start_time) - new Date(b.start_time);
    });
  }
  // 时间范围：
  const dateRange = computed(() => {
    if (!curSelectProjectTasksRef.value?.length) return { start_date: null, end_date: null };

    // 获取所有有效日期
    const validTasks = curSelectProjectTasksRef.value.filter(
      task => task.start_time && task.deadline_time
    );

    // 计算时间范围
    const startDates = validTasks.map(task => new Date(task.start_time));
    const endDates = validTasks.map(task => new Date(task.deadline_time));

    return {
      start_date: validTasks.length
        ? new Date(Math.min(...startDates)).toISOString().split('T')[0]
        : null,
      end_date: validTasks.length
        ? new Date(Math.max(...endDates)).toISOString().split('T')[0]
        : null
    };
  });

  const workLoadSta = computed(() => {
    const initial = { total: 0, completed: 0, progress: 0 };

    if (!curSelectProjectTasksRef.value?.length) return initial;

    return curSelectProjectTasksRef.value.reduce((acc, task) => {
      const workload = Number(task.workload) || 0;

      // 总工作量累加
      acc.total += workload;

      // 已完成工作量累加
      if (task.status === TaskStatus.FINISH) { acc.completed += workload; }

      // 计算完成进度（保留1位小数）
      acc.progress = acc.total > 0 ? Number((acc.completed / acc.total * 100).toFixed(1)) : 0;

      return acc;
    }, { ...initial });
  });

  const totalTasks = computed(() => { return curSelectProjectTasksRef.value?.length || 0; });

  const completedTasks = computed(() => { return curSelectProjectTasksRef.value?.filter(task => task.status === TaskStatus.FINISH).length || 0; });

  const workloadIntensity = computed(() => {
    // 获取已完成任务（假设status=5为已完成状态）
    const completedTasks = curSelectProjectTasksRef.value?.filter(task => task.status === TaskStatus.FINISH) || [];

    // 没有已完成任务时返回0
    if (completedTasks.length === 0) return 0;

    // 计算每项任务的实际/预计工作量比值并累加
    const totalRatio = completedTasks.reduce((acc, task) => {
      const workload = Number(task.workload) || 0;
      const actWorkload = Number(task.act_workload) || 0;
      return workload !== 0 ? acc + (actWorkload / workload) : acc;
    }, 0);
    // 计算平均值并保留两位小数
    return Number(100 * (totalRatio / completedTasks.length).toFixed(2));
  });

  return {
    projectFocusRef, curSelectProjectRef, curGanttData, curProjectReceiverMap, selectUser, joinUsers, workLoadSta, totalTasks, completedTasks, workloadIntensity, dateRange,
    updateCurSelectProjectTasks
  }
})