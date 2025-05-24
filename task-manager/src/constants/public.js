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
export const EvaluateList =  ['不合格', '合格', '合格+', '良-', '良', '良+', '优']
export const EvaluateMap = EvaluateList.reduce((acc, item, index) => {
  acc[item] = index + 1; // 值从1开始
  return acc;
}, {});


