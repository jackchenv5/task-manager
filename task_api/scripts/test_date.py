from dateutil import parser
from datetime import datetime


def parse_date_range(date_str):
    # 定义当前年份
    current_year = datetime.now().year

    # 尝试解析日期区间
    try:
        start_date_str, end_date_str = date_str.split('-')

        # 检查是否有年份
        has_year_start = '.' in start_date_str and len(start_date_str.split('.')[0]) == 4
        has_year_end = '.' in end_date_str and len(end_date_str.split('.')[0]) == 4

        # 解析起始日期
        if has_year_start:
            start_date = parser.parse(start_date_str, yearfirst=True, dayfirst=False)
        else:
            month, day = map(int, start_date_str.split('.'))
            start_date = datetime(current_year, month, day)

        # 解析结束日期
        if has_year_end:
            end_date = parser.parse(end_date_str, yearfirst=True, dayfirst=False)
        else:
            month, day = map(int, end_date_str.split('.'))
            end_date = datetime(current_year, month, day)

        # 确保结束日期晚于或等于起始日期
        if end_date < start_date:
            end_date = end_date.replace(year=start_date.year + 1)

        return start_date, end_date
    except (ValueError, IndexError):
        raise ValueError(f"Invalid date range format: {date_str}")


# 测试解析函数
date_ranges = [
    "7.29-8.4",
    "2024.7.29-2024.8.4",
    "2024.7.29-8.4",
    "7.29-2024.8.4",
    "7.29-7.30",
    "2024.7.29-2024.7.30",
    "12.31-1.1"  # 跨年的日期区间
]

for date_str in date_ranges:
    try:
        start_date, end_date = parse_date_range(date_str)
        print(f"Input: {date_str} -> Start: {start_date}, End: {end_date}")
    except ValueError as e:
        print(e)