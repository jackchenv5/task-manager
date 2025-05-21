export const TaskStatus = {
    PEND: 1,
    PROGRESS: 4,
    DRAFT: 3,
    FINISH: 2
}
// 将下字符串数组EvaluateMap转为对象，键为元素，值为 从1开始到7
export const EvaluateList =  ['不合格', '合格', '合格+', '良-', '良', '良+', '优']
export const EvaluateMap = EvaluateList.reduce((acc, item, index) => {
  acc[item] = index + 1; // 值从1开始
  return acc;
}, {});


