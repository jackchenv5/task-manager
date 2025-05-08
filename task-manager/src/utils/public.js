
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

// 封装基础方法
export const isWorkday = (date) => IsWorkday(date)
export const formatDate = (date) => FormatDate(date)
export const formatVxeDate = (date) => FormatVxeDate(date)
export const getDayTotalWorkHours = (events, transStr) => GetDayTotalWorkHours(events, transStr)
export const getProgressStatus = (process) => GetProgressStatus(process)
export const getCurMonthStartAndEndStr = (date) => GetCurMonthStartAndEndStr(date)
export const parseDateString = (dateStr) => ParseDateString(dateStr)



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


export const TaskStatus = {
    PEND: 1,
    PROGRESS: 4,
    DRAFT: 3,
    FINISH: 2
}