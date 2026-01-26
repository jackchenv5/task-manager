export const TaskStatus = {
    PEND: 1,
    PROGRESS: 4,
    FINISH: 2,
    ALL:0
}

export const TaskStatusLabel = {
    PEND: "待下发",
    PROGRESS: "进行中",
    FINISH: "已完成",
    ALL:"全部"
}
export const taskStatusArray = Object.entries(TaskStatus).map(([key, value]) => ({
  label:TaskStatusLabel[key],
  value
}));

// 将下字符串数组EvaluateMap转为对象，键为元素，值为 从1开始到7
export const EvaluateList =  ['不满意', '一般', '正常', '满意', '超出预期', '优秀', '极佳']

export const EvaluteType = {
  PROJECT: 'project',
  GROUP: 'group',
  USER: 'user'
}

// 统计类型常量
export const StatType = {
  TASK_SATURATION: 0,
  TASK_WORKLOAD: 1,
  PROJECT_PROGRESS: 2
}

