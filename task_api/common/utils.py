from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from dateutil import parser
import re

def is_date_range(date_str):
    # 定义支持的日期格式
    current_year = datetime.now().year

    # 尝试解析日期区间
    try:
        # 使用正则表达式匹配日期部分
        pattern = r'(\d{1,2}\.\d{1,2}-\d{1,2}\.\d{1,2})'
        # 查找匹配的日期部分
        match = re.search(pattern, date_str)

        # 提取匹配的日期部分
        if match:
            date_range = match.group(1)
        else:
            print("No match found")
            return False
        start_date_str, end_date_str = date_range.split('-')

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

        return True
    except (ValueError, IndexError):
        return False

def parse_date_range(date_str):
    # 定义支持的日期格式
    current_year = datetime.now().year

    # 尝试解析日期区间
    try:
        # 使用正则表达式匹配日期部分
        pattern = r'(\d{1,2}\.\d{1,2}-\d{1,2}\.\d{1,2})'
        # 查找匹配的日期部分
        match = re.search(pattern, date_str)

        # 提取匹配的日期部分
        if match:
            date_range = match.group(1)
        else:
            print("No match found")
            return False, None, None

        start_date_str, end_date_str = date_range.split('-')

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

        return True,start_date, end_date
    except (ValueError, IndexError):
        return False, None, None



from datetime import datetime, timedelta, date


def is_weekend(date_obj):
    """判断日期是否是周末（周六或周日）"""
    weeks_work_str_list = ["2024-09-14","2024-10-12"];
    weeks_work = [date(int(y[:4]), int(y[5:7]), int(y[8:])) for y in weeks_work_str_list]
    return date_obj.weekday() >= 5 and (not date_obj in weeks_work) # weekday()返回0（周一）到6（周日）
    # return date.weekday() >= 5 # weekday()返回0（周一）到6（周日）


def workdays_between_with_holidays(start_date, end_date):
    """计算两个日期之间的工作日（排除周末和特定节假日）"""
    if not start_date or not end_date:
        return 0
    holidays_str_list = ["2024-09-15","2024-09-16","2024-09-17","2024-10-01", "2024-10-02","2024-10-03","2024-10-04","2024-10-07"];

    holidays = [date(int(y[:4]), int(y[5:7]), int(y[8:])) for y in holidays_str_list]  # 将字符串转换为date对象

    delta = end_date - start_date
    days_between = delta.days + 1
    workdays = sum(1 for day in range(days_between) if not (is_weekend(start_date + timedelta(days=day)) or (start_date + timedelta(days=day)) in holidays) )
    return workdays

def custom_model_to_dict(instance):
    from django.db.models.fields import DateTimeField,DateField
    from django.contrib.auth import get_user_model
    User = get_user_model()
    data = {}
    for field in instance._meta.fields:
        # value = field.value_from_object(instance)
        value = getattr(instance, field.name)
        if isinstance(value, User):
            data[field.name] = value.username
        elif isinstance(field, (DateField, DateTimeField)):
            data[field.name] = value.strftime('%Y-%m-%d') if value else None
        else:
            data[field.name] = value
    return data
