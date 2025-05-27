
import { getEvaluation } from '@/api/data/data'

import { TaskStatus,EvaluteType } from '@/constants/public'

import { calWorkdays, formatDate } from '@/utils/public'

// 统计所选任务的总工作量，已完成量，进度,总数，已完成，未完成，进行中，待下发，项目数
export const workLoadStat = (tasks) => {
  const initial = { total: 0, completed: 0, progress: 0, progressPer: 0, finish: 0, pend: 0, allCount: 0, finishCount: 0, pendCount: 0, progressCount: 0, projects: [] };

  console.log('tasks', tasks)
  if (!tasks.length || tasks.length === 0) return initial;

  return tasks.reduce((acc, task) => {
    const workload = Number(task.workload) || 0;

    // 总工作量累加
    acc.total += workload;
    acc.allCount += 1;
    if (!acc.projects.includes(task.project)) {
      acc.projects.push(task.project)
    }

    if (task.status === TaskStatus.PEND) {
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


export const groupWorkloadSaturation = (workloads, groupNum, startDate, endDate) => {
  const workdays = calWorkdays(startDate, endDate)
  console.log('workload staturation', workdays, groupNum, startDate, endDate)
  const per = workloads / (groupNum * workdays) * 100
  return per.toFixed(1)
};



export const sortByString = (data, sortFields) => {

  const sortedData = [...data].sort((a, b) => {
    for (const field of sortFields) {
      const compareResult = String(a[field]).localeCompare(String(b[field]));
      if (compareResult !== 0) return compareResult;
    }
    return 0;
  });
  return sortedData
}

export function compareDateStrings(dateStr1, dateStr2) {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);

  if (date1 > date2) return 1;      // date1 更晚
  else if (date1 < date2) return -1; // date1 更早
  else return 0;                     // 相等
}

const getEvalutionMap = async (evaluator,users,yearMonth,evaluation_type) =>{
    // 异步获取评价数据
    const evaluationsMap = {}
    const evaluations = await getEvaluation({
      evaluator: evaluator,
      evaluation_type: evaluation_type,
      users: users.join(','),
      year_month: formatDate(yearMonth, true)
    });
  
    for (const evaluation of evaluations) {
      if (!evaluationsMap[evaluation.evaluated_user_username]) {
        evaluationsMap[evaluation.evaluated_user_username] = {};
      }
      if (!evaluationsMap[evaluation.evaluated_user_username][evaluation.project]) {
        evaluationsMap[evaluation.evaluated_user_username][evaluation.project] = evaluation;
      }
    }
    return evaluationsMap
}
export const mergeTasks = async (tasks, evaluator, users, yearMonth,evaluation_type=EvaluteType.GROUP) => {
  console.log(yearMonth,formatDate(yearMonth, true),formatDate(yearMonth))
  const empty = '';
  const retList = [];
  const tmpTasks = sortByString(tasks, ['receiver_name', 'project', 'start_time']);
  const retData = {};
  const evaluationsMap = await getEvalutionMap(evaluator,users,yearMonth,evaluation_type)
  let evaluationsPersonMap = null
  // 组评价信息，需要加上个人自评的信息
  if(evaluation_type === EvaluteType.GROUP ){
     evaluationsPersonMap = await getEvalutionMap(evaluator,users,yearMonth,EvaluteType.USER)
  }
  
  // 使用 for...of 处理异步任务
  for (const task of tmpTasks) {
    if (!retData[task.receiver_name]) {
      retData[task.receiver_name] = {};
    }

    if (!retData[task.receiver_name][task.project]) {
      const evaluationInfo = evaluationsMap?.[task.receiver_name]?.[task.project] ||
      {
        'evaluated_user': task.receiver, evaluation_type: evaluation_type, 'evaluated_user_username': task.receiver_name, evaluator: evaluator, comment: '', score: 0,
        project: task.project,
        evaluation_time: formatDate(yearMonth)
      }

      if(evaluationsPersonMap){
        retData[task.receiver_name][task.project] = {
          receiver: task.receiver,
          project: task.project,
          workloads: 0,
          act_workloads: 0,
          start_time: null,
          deadline_time: null,
          evaluation_user_commnet: evaluationsPersonMap?.[task.receiver_name]?.[task.project]?.comment || '',
          evaluation__user_score: evaluationsPersonMap?.[task.receiver_name]?.[task.project]?.score || 0,
          evaluation: evaluationInfo,
          evaluation_score: evaluationInfo.score,
          evaluation_comment: evaluationInfo.comment,
          tasks: []
        };
      }else{
        retData[task.receiver_name][task.project] = {
          receiver: task.receiver,
          project: task.project,
          workloads: 0,
          act_workloads: 0,
          start_time: null,
          deadline_time: null,
          evaluation: evaluationInfo,
          evaluation_score: evaluationInfo.score,
          evaluation_comment: evaluationInfo.comment,
          tasks: []
        };
      }

    }

    // 同步累加数据
    retData[task.receiver_name][task.project].workloads += task.workload;
    retData[task.receiver_name][task.project].act_workloads += task.act_workload;

    // 处理日期逻辑
    const curStartTime = retData[task.receiver_name][task.project].start_time;
    const curDeadlineTime = retData[task.receiver_name][task.project].deadline_time;

    if (!curStartTime || compareDateStrings(curStartTime, task.start_time) < 0) {
      retData[task.receiver_name][task.project].start_time = task.start_time;
    }

    if (!curDeadlineTime || compareDateStrings(curDeadlineTime, task.deadline_time) >= 0) {
      retData[task.receiver_name][task.project].deadline_time = task.deadline_time;
    }

    retData[task.receiver_name][task.project].tasks.push({ ...task });
  }

  // 转换数据结构为数组
  Object.keys(retData).forEach((userName, indexUserName) => {
    const userData = retData[userName];
    let displayName = userName;

    Object.keys(userData).forEach((projectName, indexProject) => {
      if (indexProject !== 0) displayName = empty;
      retList.push({
        receiver_name: displayName,
        ...userData[projectName]
      });
    });
  });
  console.log('retList===========================>', retList);
  return retList;
};