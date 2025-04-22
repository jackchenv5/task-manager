
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
    if (!(date instanceof Date)) return date;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 获取日历中每一天的工时总数
const GetDayTotalWorkHours = (events) => {
    let totalHours = 0;
    events.forEach(e => {
        const eventStart = new Date(e.start_date);
        const eventEnd = new Date(e.end_date);

        // 跨天任务：计算该任务在当天应分配的工时
        if (eventStart.getDate() !== eventEnd.getDate() || 
            eventStart.getMonth() !== eventEnd.getMonth() ||
            eventStart.getFullYear() !== eventEnd.getFullYear()) {
            
            // 统计任务期间的有效工作日
            let workdays = 0;
            const cur = new Date(eventStart);
            while (cur <= eventEnd) {
                if (isWorkday(cur)) workdays++;
                cur.setDate(cur.getDate() + 1);
            }

            // 均分总工时到每个有效工作日
            if (workdays > 0) {
                totalHours += (e.hours || 0) / workdays;
            }
        } else {
            // 单天任务直接累加工时
            totalHours += (e.hours || 0);
        }
    });
    return totalHours.toFixed(2);
}

const GetProgressStatus = (process) => {
    const percent = parseInt(process);
    if (percent >= 100) return 'success';
    if (percent >= 70) return 'primary';
    if (percent >= 30) return 'warning';
    return 'exception';
  };

// 封装基础方法
export const isWorkday = (date) => IsWorkday(date)
export const formatDate = (date) => FormatDate(date)
export const formatVxeDate = (date) => FormatVxeDate(date)
export const getDayTotalWorkHours = (events) => GetDayTotalWorkHours(events)
export const getProgressStatus = (process) => GetProgressStatus(process)
