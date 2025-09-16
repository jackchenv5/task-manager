import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { getTaskDataApi, commitEvalution,getLogList,getEvaluation,updateEvalution } from '@/api/data/data'
import { useUserStore } from '@/stores/user'

import { workLoadStat } from '@/utils/tasksStat'

import { reverseDateStr, percentToDecimal, TaskStatus, formatDate,getDateStr,calWorkdays } from '@/utils/public'

import { EvaluateList, EvaluteType } from '@/constants/public'

const myUserStore = useUserStore()

const { loginUser } = storeToRefs(myUserStore)

//
export const useProjectStore = defineStore('project', () => {

  // 需要加载的配置
  const projectFocusRef = ref([])
  const curSelectProjectRef = ref('')
  const curSelectProjectTasksRef = ref([])
  const selectUser = ref({})
  const projectLogs = ref([])
  const monthRange = ref('')
  const taskType = ref(0)

  const updateMonthRange = (newRange)=>{
    if(newRange){
      const start = new Date(newRange[0].getFullYear(), newRange[0].getMonth(), 1);
      const end = new Date(newRange[1].getFullYear(), newRange[1].getMonth() + 1, 0);
      monthRange.value = [start,end]
    }else{
      monthRange.value = newRange
    }

  }
  // 项目日志
  const updateProjectLogs = async () => {
    if(!curSelectProjectRef.value  || curSelectProjectRef.value == null || Object.keys(curSelectProjectRef.value).length === 0) return
    const res = await getLogList({project: curSelectProjectRef.value,timestamp: getDateStr(1)})
    console.log(res)
    projectLogs.value = res.length > 0 ? res : []
  }
  const cleanSelectUser = () => {
    selectUser.value = {}
  }


  const deleteProjectInFocus = (project) => {
    const projectIndex = projectFocusRef.value.indexOf(project)
    projectFocusRef.value.splice(projectIndex, 1)
    saveProjectConfig()
  }
  const addToProjectFocus = (project) => {
    if (projectFocusRef.value.includes(project)) return
    projectFocusRef.value.push(project)
    saveProjectConfig()
  }
  const cleanFocus = () => {
    projectFocusRef.value = []
    saveProjectConfig()
  }
  // 一次加载所有关于schedule 的config
  const initScheduleConfig = () => {
    const project_pool = myUserStore.getUserConfig('project_project_pool', [])
    projectFocusRef.value = project_pool
    curSelectProjectRef.value = myUserStore.getUserConfig('project_cur_select_project', '')
  }

  const saveProjectConfig = () => {
    myUserStore.setUserConfig('project_project_pool', projectFocusRef.value)
    myUserStore.setUserConfig('project_cur_select_project', curSelectProjectRef.value)
  }

  //

  const init = () => {
    initScheduleConfig()
    updateCurSelectProjectTasks()
    updateProjectLogs()
  }



  // 甘特数据格式化
  const curGanttData = computed(() => {
    if (!curSelectProjectTasksRef.value?.length) return [];
    //根据用户日期过滤
    let dateRangeData = []
    if(monthRange.value){
      dateRangeData = curSelectProjectTasksRef.value.filter(x=>{
        //任务结束时间大于用户选择月 或者 任务开始时间 小于用户选择结结束月
        const startDate = new Date(x.start_time)
        const endDate = new Date(x.deadline_time)
        if(startDate >= monthRange.value[0] && startDate <= monthRange.value[1]) return true
        if(endDate >= monthRange.value[0] && endDate <= monthRange.value[1]) return true
      })
    }else{
      dateRangeData = curSelectProjectTasksRef.value
    }
    if(taskType.value){
      dateRangeData = dateRangeData.filter(x=> taskType.value === x.status)
    }
    return dateRangeData.map(x => ({
      ...x,
      text: x.name,
      start_date: reverseDateStr(x.start_time),
      duration:  calWorkdays(x.start_time,x.deadline_time),
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

  const joinUsers = computed(() => {
    const users = []
    const retData = [];
    if (!curGanttData.value?.length) return retData;

    curGanttData.value.forEach(x => {
      if (users.includes(x.receiver_name)) return;
      users.push(x.receiver_name);
      retData.push({ id: x.receiver, username: x.receiver_name })
    });
    return retData;
  });

  const curSelectUserStat = computed(() => {
    const curUserTasks = curProjectReceiverMap.value[selectUser.value.username];
    const retData = workLoadStat(curUserTasks);
    retData.participation = (retData.total / workLoadSta.value.total * 100).toFixed(1);
    return retData;
  });
  const curUserEvalution = ref({})
  const updateCurSelectUserEvalution = async ()=>{ 
    if(!selectUser.value.username) return {}
    const evaluations = await getEvaluation({
      project: curSelectProjectRef.value,
      evaluated_user: selectUser.value.id,
      year_month: formatDate(new Date(), true)
    });
    curUserEvalution.value = evaluations.reduce((acc, cur) => {
      if(!acc[cur.evaluation_type]) acc[cur.evaluation_type] = {...cur,scoreValue:EvaluateList[cur.score -1]};
      return acc;
    }, {});
  }
  const commitCurUserEvalution = async (e)=>{
    let ret = null
    
    if(!e.id){
      
        ret = await commitEvalution({
          project: curSelectProjectRef.value,
          evaluator: loginUser.value.id,
          evaluated_user: selectUser.value.id,
          evaluation_type: EvaluteType.PROJECT,
          evaluation_time: formatDate(new Date()),
          score:e.score,
          comment:e.comment
        })
        }else{
        const {id,...commitData} = e
        
        ret = await updateEvalution(id,e)
    }
    updateCurSelectUserEvalution()
    return ret?.id ? true : false
}
  const cleanUserValution = () => {
    curUserEvalution.value = {};
  };

  watch(curSelectProjectRef, (newValue) => {
    saveProjectConfig()
    updateCurSelectProjectTasks()
    updateProjectLogs()
    cleanSelectUser()
    cleanUserValution()
  })

  watch(selectUser, (newValue) => {
    updateCurSelectUserEvalution()
  })


  const updateCurSelectProjectTasks = async () => {
    if(!curSelectProjectRef.value  || Object.keys(curSelectProjectRef.value).length === 0) return
    const toSortItems = await getTaskDataApi({ project: curSelectProjectRef.value })

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
    return workLoadStat(curSelectProjectTasksRef.value)
  });

  const totalTasks = computed(() => { return curSelectProjectTasksRef.value?.length || 0; });

  const completedTasks = computed(() => { return curSelectProjectTasksRef.value?.filter(task => task.status === TaskStatus.FINISH).length || 0; });

  const pendTasks = computed(() => { return curSelectProjectTasksRef.value?.filter(task => task.status === TaskStatus.PEND).length || 0; });

  const runTasks = computed(() => { return curSelectProjectTasksRef.value?.filter(task => task.status === TaskStatus.PROGRESS).length || 0; });

  const draftTasks = computed(() => { return curSelectProjectTasksRef.value?.filter(task => task.status === TaskStatus.DRAFT).length || 0; });

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
    init,
    // 项目聚焦
    //月选择
    taskType,monthRange,updateMonthRange,
    projectFocusRef, curSelectProjectRef, deleteProjectInFocus, addToProjectFocus, cleanFocus,
    curGanttData, curProjectReceiverMap, joinUsers, workLoadSta, totalTasks, completedTasks, pendTasks, draftTasks, runTasks, workloadIntensity, dateRange,
    updateCurSelectProjectTasks,
    //当前选中的用户
    selectUser, curSelectUserStat, cleanSelectUser,
    //评价
    commitCurUserEvalution,curUserEvalution,
    projectLogs
  }
})