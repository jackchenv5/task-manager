
import { TaskStatus } from '@/constants/public'

import {calWorkdays} from '@/utils/public'


// 统计所选任务的总工作量，已完成量，进度,总数，已完成，未完成，进行中，待下发，项目数
export const workLoadStat = (tasks) => {
  const initial = { total: 0, completed: 0, progress: 0, progressPer: 0, finish: 0, pend: 0, allCount: 0, finishCount: 0, pendCount: 0, progressCount:0, projects: [] };

  console.log('tasks',tasks)
  if ( !tasks.length || tasks.length === 0 ) return initial;

  return tasks.reduce((acc, task) => {
    const workload = Number(task.workload) || 0;

    // 总工作量累加
    acc.total += workload;
    acc.allCount += 1;
    if (!acc.projects.includes(task.project)) {
      acc.projects.push(task.project)
    }

    if(task.status === TaskStatus.PEND){
      acc.pendCount += 1;
      acc.pend += workload;
    }

    if (task.status === TaskStatus.FINISH) {
      acc.completed += workload;
      acc.finishCount += 1;
    }

    // 已完成累加进行中
    if (task.status === TaskStatus.PROGRESS) { 
      acc.completed += workload * task.progress / 100; 
      acc.progressCount += 1;
    }

    // 计算完成进度（保留1位小数）
    acc.progress = acc.total > 0 ? Number((acc.completed / acc.total * 100).toFixed(1)) : 0;

    return acc;
  }, { ...initial });
};


export const groupWorkloadSaturation = (workloads,groupNum,startDate,endDate) => {
  const  workdays = calWorkdays(startDate, endDate)
  console.log('workload staturation',workdays,groupNum,startDate,endDate)
  const per = workloads /(groupNum * workdays) * 100
  return per.toFixed(1)
};