
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
const FormatDate = (date) => {
    if (!(date instanceof Date)) date = new Date(date);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
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
        .reduce((sum, e) => sum + ((e.workload * 8) / e.diff_days), 0)
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
    const weekStart = new Date(week.start);
    const weekEnd = new Date(week.end);
    const taskStart = new Date(task.start_date);
    const taskEnd = new Date(task.end_date);
  
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
export const formatDate = (date) => FormatDate(date)
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

export  function getWeekBoundaries(date) {
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
        const weekEnd = new Date(currentWeekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        const actualEnd = weekEnd > lastDay ? lastDay : weekEnd
        
        // 仅当周的开始或结束日期在当月内时才添加
        if (actualStart <= lastDay && actualEnd >= firstDay) {
        // 计算工作日天数
        const workday = calculateWorkdays(actualStart, actualEnd);
        
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
    
    // 辅助函数：将日期格式化为 YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }
    
    // 辅助函数：计算两个日期之间的工作日天数（周一至周五）
    function calculateWorkdays(startDate, endDate) {
        let count = 0;
        const currentDate = new Date(startDate);
        
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
    
    return weeks
}

export function getFisrtAndLastDay(year, month) {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    return [firstDay, lastDay]
}

export function getWorkdaysBetweenDates(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const workday = []

    while (start <= end) {
        const day = start.getDay(); // 0是周日，6是周六
        
        // 检查是否是工作日（周一至周五）
        if (day !== 0 && day !== 6) {
        workday.push(new Date(start))
        }
        
        // 增加一天
        start.setDate(start.getDate() + 1)
    }
    return workday.length
}
  
export function getWorkdaysInWeek(week, task) {
    const weekStart = new Date(week.start)
    const weekEnd = new Date(week.end)
    const taskStart = new Date(task.start_date)
    const taskEnd = new Date(task.end_date)

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
  