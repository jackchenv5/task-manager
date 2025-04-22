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

const isWorkday = (date) => {
    const dateStr = formatDate(date);
    const dayOfWeek = date.getDay();

    if (extraWorkdays[dateStr]) return true;
    if (holidays[dateStr]) return false;
    return dayOfWeek !== 0 && dayOfWeek !== 6;
};