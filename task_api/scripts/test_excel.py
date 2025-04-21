import django
import os
import sys

#启动django
from pathlib import Path
from django.core.mail import send_mail

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0,BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'task_api.settings')
django.setup()
from task.models import Task
import pandas as pd
from django.http import HttpResponse

def export_tasks_to_excel(request):
    # 假设你有一个函数来获取任务数据
    tasks = Task.objects.all()  # 这是一个你需要定义的函数
    # 准备数据框
    data = []
    for task in tasks:
        row = {
            'name': task.name,
            'category': task.category.name,  # 假设 TaskCategory 有一个 name 字段
            'creater': task.creater.username,  # 假设 User 有一个 username 字段
        }
        data.append(row)

    df = pd.DataFrame(data)

    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename="tasks.xlsx"'

    with pd.ExcelWriter(response, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)

    return response

if __name__ == '__main__':
    export_tasks_to_excel()