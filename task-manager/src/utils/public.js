
// 示例：2025年中国法定节假日
const holidays = {
    "2025-01-01": "元旦",
    "2025-02-08": "春节",
    "2025-02-09": "春节",
    "2025-04-05": "清明节",
    "2025-05-01": "劳动节",
    "2025-06-14": "端午节",
    "2025-09-21": "中秋节",
    "2025-10-01": "国庆节",
};

// 调休工作日
const extraWorkdays = {
    "2025-02-15": true,
    "2025-10-11": true,
};

// 判断日期是否工作日
const IsWorkday = (date) => {
    const dateStr = formatDate(date);
    const dayOfWeek = date.getDay();

    if (extraWorkdays[dateStr]) return true;
    if (holidays[dateStr]) return false;
    return dayOfWeek !== 0 && dayOfWeek !== 6;
};

// 辅助函数：格式化日期为 YYYY-MM-DD
export const formatDate = (date,isMonth=false) => {
    if (!(date instanceof Date)) date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    if(isMonth) return `${year}-${month}`
    return `${year}-${month}-${day}`;
};


// 辅助函数：格式化日期为 YYYY-MM-DD ( VXE表格使用)
const FormatVxeDate = (date) => {
    if (!(date instanceof Date)) {
        return date.split(' ')[0];
    };
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


export const getDateStr = (diffDays = 0) => {
    return new Date(+new Date() + 8 * 3600 * 1000 - diffDays * 24 * 3600 * 1000)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19);
}

// 获取日历中每一天的工时总数
// const GetDayTotalWorkHours = (events) => {
//     let totalHours = 0;
//     events.forEach(e => {
//         totalHours += ((e.workload * 8) / e.diff_days);
//     });
//     return totalHours.toFixed(1);
// }

const GetDayTotalWorkHours = (events, transStr = true) => {
    const total = events
        .filter(e => e.status_name !== '草稿')
        .reduce((sum, e) => sum + ((e.workload * 8) / calWorkdays(e.start_time,e.deadline_time)), 0)
    return transStr ? total.toFixed(1) : total
};

const GetProgressStatus = (process) => {
    const percent = parseInt(process);
    if (percent >= 100) return 'success';
    if (percent >= 70) return 'primary';
    if (percent >= 30) return 'warning';
    return 'exception';
};

// added by chenchengf

// 获取当前月的起始日期字符，用于日历组件
const GetCurMonthStartAndEndStr = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const startDate = formatDate(firstDay);
    const endDate = formatDate(lastDay);
    return [startDate, endDate]
}

/**
 * 将"YYYY-MM-DD"格式的日期字符串转换为Date对象
 * @param {string} dateStr - 格式为"2025-02-08"的日期字符串
 * @returns {Date} 对应的Date对象
 * @throws {Error} 如果输入格式不正确则抛出错误
 */
function ParseDateString(dateStr) {
    // 验证输入格式
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        throw new Error('日期格式不正确，应为YYYY-MM-DD格式');
    }

    // 分割年月日
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 月份从0开始
    const day = parseInt(parts[2], 10);

    // 验证日期有效性
    const date = new Date(year, month, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
    ) {
        throw new Error('无效的日期');
    }

    return date;
}

// END 

// added by zhangtaod
const GetWorkdaysInMonth = (dateInfo) => {
    const year = dateInfo.value[0]
    const month = dateInfo.value[1]
    const date = new Date(year, month - 1, 1)
    let workdays = 0

    while (date.getMonth() === month - 1) {
        if (IsWorkday(date)) {
            workdays++
        }
        date.setDate(date.getDate() + 1)
    }
    return workdays
}

// 判断任务是否在当前周内
function IsTaskInWeek(week, task) {
    // 将日期字符串转换为日期对象
    if(Object.keys(week).length === 0) return true
    const weekStart = new Date(week.start);
    const weekEnd = new Date(week.end);
    const taskStart = new Date(task.start_time);
    const taskEnd = new Date(task.deadline_time);


    // 检查任务开始日期是否在周范围内
    if (taskStart >= weekStart && taskStart <= weekEnd) {
        return true;
    }

    // 检查任务结束日期是否在周范围内
    if (taskEnd >= weekStart && taskEnd <= weekEnd) {
        return true;
    }

    // 检查任务是否完全包含周（周在任务范围内）
    if (taskStart <= weekStart && taskEnd >= weekEnd) {
        return true;
    }

    return false;
}

// 封装基础方法
export const isWorkday = (date) => IsWorkday(date)
export const formatVxeDate = (date) => FormatVxeDate(date)
export const getDayTotalWorkHours = (events, transStr) => GetDayTotalWorkHours(events, transStr)
export const getProgressStatus = (process) => GetProgressStatus(process)
export const getCurMonthStartAndEndStr = (date) => GetCurMonthStartAndEndStr(date)
export const parseDateString = (dateStr) => ParseDateString(dateStr)
export const getWorkdaysInMonth = (dateInfo) => GetWorkdaysInMonth(dateInfo)
export const isTaskInWeek = (week, task) => IsTaskInWeek(week, task)



// 辅助函数：格式化日期为 YYYY-MM-DD day-month-year
export function reverseDateStr(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export function percentToDecimal(percentStr) {
    // 1. 检查输入是否为字符串或数字
    if (typeof percentStr !== "string" && typeof percentStr !== "number") {
        console.warn("Invalid input: expected a string or number");
        return 0; // 默认返回 0 或抛出错误
    }

    // 2. 如果是数字，直接除以 100（兼容数字输入）
    if (typeof percentStr === "number") {
        return percentStr / 100;
    }

    // 3. 移除可能的百分号（如 "50%" -> "50"）
    const cleanedStr = percentStr.replace("%", "");

    // 4. 转换为数字并除以 100
    const number = parseFloat(cleanedStr);
    if (isNaN(number)) {
        console.warn("Invalid input: could not parse to number");
        return 0; // 默认返回 0 或抛出错误
    }

    return number / 100;
}

export function getWeekBoundaries(date) {
    // 创建日期对象的副本以避免修改原对象
    const d = new Date(date);

    // 获取当前是星期几（0表示周日，1表示周一，...，6表示周六）
    const day = d.getDay();

    // 计算到周一的天数差（如果是周日，需要减去6天）
    const diffToMonday = day === 0 ? -6 : 1 - day;

    // 计算到周五的天数差（如果是周日，需要减去2天）
    const diffToFriday = day === 0 ? -2 : 5 - day;

    // 计算周一的日期
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0); // 重置时间为00:00:00

    // 计算周五的日期
    const friday = new Date(d);
    friday.setDate(d.getDate() + diffToFriday);
    friday.setHours(23, 59, 59, 999); // 设置为周五的最后一刻

    return { monday, friday };
}


export const TaskStatus = {
    PEND: 1,
    PROGRESS: 4,
    DRAFT: 3,
    FINISH: 2
}

export function getWeeksInMonth(year, month) {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)

    const weeks = []
    let currentWeekStart = new Date(firstDay)

    // 调整到周一开始
    if (currentWeekStart.getDay() !== 1) {
        const diff = currentWeekStart.getDay() - 1
        currentWeekStart.setDate(currentWeekStart.getDate() - (diff >= 0 ? diff : 6))
    }

    let weekIndex = 1

    while (currentWeekStart <= lastDay) {
        // 计算本周的实际开始和结束日期
        const actualStart = currentWeekStart < firstDay ? firstDay : currentWeekStart
        const weekEnd = new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 6)
        const actualEnd = weekEnd > lastDay ? lastDay : weekEnd

        // 仅当周的开始或结束日期在当月内时才添加
        if (actualStart <= lastDay && actualEnd >= firstDay) {
            // 计算工作日天数
            const workday = calWorkdays(actualStart, actualEnd);

            weeks.push({
                start: formatDate(actualStart),
                end: formatDate(actualEnd),
                label: `第${weekIndex}周`,
                workday: workday
            })
            weekIndex++
        }

        currentWeekStart.setDate(currentWeekStart.getDate() + 7)
    }
    return weeks
}
export function calWorkdays(startDate, deadlineDate) {
    let count = 0;
    const currentDate = new Date(startDate);
    const endDate = new Date(deadlineDate);
    while (currentDate <= endDate) {
        const day = currentDate.getDay();
        // 1-5 对应周一至周五
        if (day >= 1 && day <= 5) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
}

export function getFisrtAndLastDayOfMonth(date, isStr = true) {
    const dateObj = date ? date : new Date()

    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1

    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    if (isStr) return [formatDate(firstDay), formatDate(lastDay)]
    return [firstDay, lastDay]
}

export function getYearAndMonth(date, isStr = false) {
    const dateObj = date ? date : new Date()

    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1
    if (isStr) return `${year}年${month}月`
    return [year, month]
}


export function getWorkdaysInWeek(week, task) {
    const weekStart = new Date(week.start)
    const weekEnd = new Date(week.end)
    const taskStart = new Date(task.start_time)
    const taskEnd = new Date(task.deadline_time)

    // 计算重叠范围的开始和结束日期
    const overlapStart = new Date(Math.max(weekStart, taskStart));
    const overlapEnd = new Date(Math.min(weekEnd, taskEnd));

    // 如果没有重叠，返回0
    if (overlapStart > overlapEnd) {
        return 0;
    }

    let workdayCount = 0;
    const currentDate = new Date(overlapStart);

    // 遍历重叠范围内的每一天，计算工作日
    while (currentDate <= overlapEnd) {
        const dayOfWeek = currentDate.getDay();
        // 1-5 是周一到周五
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            workdayCount++;
        }
        // 移动到下一天
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return workdayCount;
}


export const formatDateTime = (date) => {
    if (!(date instanceof Date)) date = new Date(date);
    return new Date(date + 8 * 3600 * 1000)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19);
};

//获取当前月
export const getCUrrentMonth = () => {
    return new Date().getMonth() + 1;
};
export const getUserWeeksDataMap = (tasks, weeks, users) => {
    const result = {};

    // 初始化结果对象
    users.forEach(userName => {
        result[userName] = {};
        weeks.forEach((week, index) => {
            result[userName][index] = {
                bgColor: '#eee',
                count: 0,
                saturation: '0'
            };
        });
    });

    // 遍历所有任务
    tasks.forEach(task => {
        const userName = task.receiver_name;
        if (!users.includes(userName)) return;

        // 遍历所有周，检查任务是否在该周内
        weeks.forEach((week, index) => {
            if (!isTaskInWeek(week, task)) return;
            const taskDuration = calWorkdays(task.start_time, task.deadline_time);
            
            // 判断周是否为已经过去的周
            const currentDate = new Date();
            const weekEnd = new Date(week.end);
            const isPastWeek = weekEnd < currentDate;
            
            let peerDayWorkload = 0;
            
            if (isPastWeek) {
                // 如果是已经过去的周
                if (task.status === TaskStatus.PEND) {
                    peerDayWorkload = 0;
                } else if (task.status === TaskStatus.PROGRESS || task.status === TaskStatus.FINISH) {
                    peerDayWorkload = task.act_workload / taskDuration;
                }
            } else {
                // 如果是当前或未来的周，使用原来的计算方式
                peerDayWorkload = task.workload / taskDuration;
            }

            const workdaysInWeek = getWorkdaysInWeek(week, task);
            const weekWorkload = peerDayWorkload * workdaysInWeek;

            // 更新当前用户当前周的数据
            result[userName][index].count += 1;
            const currentWeekWorkloads = parseFloat(result[userName][index].saturation) * week.workday / 100 + weekWorkload;

            // 计算饱和度
            const saturation = week.workday > 0 ? (currentWeekWorkloads / week.workday) * 100 : 0;
            result[userName][index].saturation = saturation.toFixed(0);

            // 设置背景颜色
            if (saturation > 0 && saturation < 100) {
                result[userName][index].bgColor = 'rgb(94, 94, 214)';
            } else if (saturation >= 100 && saturation <= 110) {
                result[userName][index].bgColor = 'green';
            } else if (saturation > 110 && saturation <= 120) {
                result[userName][index].bgColor = 'orange';
            } else if (saturation > 120) {
                result[userName][index].bgColor = 'rgb(129, 9, 9)';
            }

            week[userName] = saturation.toFixed(0);
        });
    });

    return result;
};

export const getUserWeeksDataMapBak = (tasks,weeks, users) => {
    const result = {}
    users.forEach(userName => {
        result[userName] = {}
        weeks.forEach((week, index) => {

            let currentWeekWorkloads = 0
            let count = 0

            tasks.forEach(task => {
                // 如果任务执行者不是当前选中的用户， 继续遍历下一个
                if (task.receiver_name !== userName) return

                if (!isTaskInWeek(week, task)) return
                // 计算当前任务在这一周内的总工作量
                const taskDuration = calWorkdays(task.start_time, task.deadline_time)
                const peerDayWorkload = task.workload / taskDuration
                const workdaysInWeek = getWorkdaysInWeek(week, task)
                const weekWorkload = peerDayWorkload * workdaysInWeek

                currentWeekWorkloads += weekWorkload
                count += 1
            })

            // 计算饱和度，防止除零错误
            const saturation = week.workday > 0 ? (currentWeekWorkloads / week.workday) * 100 : 0

            // 根据饱和度设置背景颜色
            let bgColor = '#eee'
            if (saturation > 0 && saturation < 100) {
                bgColor = 'rgb(94, 94, 214)'
            } else if (saturation >= 100 && saturation <= 110) {
                bgColor = 'green'
            } else if (saturation > 110 && saturation <= 120) {
                bgColor = 'orange'
            } else if (saturation > 120) {
                bgColor = 'rgb(129, 9, 9)'
            }

            result[userName][index] = {
                bgColor: bgColor,
                count: count,
                saturation: saturation.toFixed(0)
            }
            week[userName] = saturation.toFixed(0)
        })
    })

    return result

}

export function objectToQueryString(obj) {
    // 创建一个空字符串用于存放最终的查询字符串
    let queryString = "";
    // 遍历对象的所有键值对
    for (let key in obj) {
      // 确保属性属于对象本身而不是原型链上的:w
      if (obj.hasOwnProperty(key)) {
        // 对值进行encodeURIComponent编码，以处理特殊字符
        let value = encodeURIComponent(obj[key]);
        if(!value || value === "undefined") continue;
        
        // 如果是第一个键值对，则不需要添加&
        if (queryString !== "") {
          queryString += "&";
        }
        queryString += `${key}=${value}`;
      }
    }
  
    return queryString;
  }

// 获取近6个月的日期范围
// 返回格式: [startDate, endDate]
export function getLastSixMonthsRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5); // 6个月前
  startDate.setDate(1); // 设置为当月第一天
  
  return [formatDate(startDate), formatDate(endDate)];
}

// 格式化月份为 YYYY-MM 格式
export function formatMonth(date) {
  if (!(date instanceof Date)) date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}