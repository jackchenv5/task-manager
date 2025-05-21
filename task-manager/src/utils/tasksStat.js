
import {TaskStatus} from '@/constants/public'
// 统计所选任务的总工作量，已完成量，进度


export  const workLoadStat = (tasks) => {
    const initial = { total: 0, completed: 0, progress: 0 };

    if (tasks.length === 0) return initial;

    return tasks.reduce((acc, task) => {
      const workload = Number(task.workload) || 0;

      // 总工作量累加
      acc.total += workload;

      // 已完成工作量累加
      if (task.status === TaskStatus.FINISH) { acc.completed += workload; }

      // 已完成累加进行中
      if (task.status === TaskStatus.PROGRESS) { acc.completed += workload * task.progress / 100; }

      // 计算完成进度（保留1位小数）
      acc.progress = acc.total > 0 ? Number((acc.completed / acc.total * 100).toFixed(1)) : 0;

      return acc;
    }, { ...initial });
};