import os
import string
import sys
from datetime import datetime, timedelta
# 启动django
from pathlib import Path

import django

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'task_api.settings')
django.setup()
from django.conf import settings
from django.contrib.auth import get_user_model  # 导入Django的用户模型
from task.models import Task
import  common
User = get_user_model()

from django.core.mail import EmailMessage
from django.template import Template, Context

def get_current_week_range():
    today = datetime.now()  # 获取当前时间，并指定为UTC时区
    start_of_week = today - timedelta(days=today.weekday())  # 获取本周一
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_week = start_of_week + timedelta(days=6, hours=23, minutes=59, seconds=59)  # 获取本周日的最后一秒

    return start_of_week, end_of_week

if __name__ == '__main__':
    # 进行中的任务
    today = datetime.today()
    current_month = today.month
    current_year = today.year
    #tasks = Task.objects.filter(start_time__year=current_year, start_time__month=current_month,status_id__in=[common.PROGRESS,common.FINISH]).order_by('project','status', 'receiver', 'start_time')
    start_of_week, end_of_week = get_current_week_range()
    tasks = Task.objects.filter(start_time__gte=start_of_week, deadline_time__lte=end_of_week, status_id__in=[common.PROGRESS, common.FINISH]).order_by('receiver', 'status', 'start_time', 'project')
    tasks_project_dict = {}
    creator_dict = {}
    for task in tasks:
        project = task.project
        if not task.creator:
            continue
        creator_email = task.creator.email
        if project not in tasks_project_dict:
            tasks_project_dict[project] = []
            creator_dict[project] = []
        if creator_email not in creator_dict[project]:
            creator_dict[project].append(creator_email)
        tasks_project_dict[project].append(task)

    # 生成 HTML 表格
    template_path = os.path.join(settings.BASE_DIR, 'templates/tasks/task_report_tl.html')
    # 读取模板内容
    with open(template_path, 'r') as file:
        template_content = file.read()
    # 创建模板对象
    template = Template(template_content)
    from_email = 'scmsender@rd.maipu.com'  # 修改为你的发件人邮箱
    #通知执行者
    for project,tasks in tasks_project_dict.items():
        # u = User.objects.get(username=user)
        u = User.objects.get(username="陈成F")
        # print(creator_dict[project])
        if not project:
            continue
        subject = '【任务系统-%s-测试周报】'% project
        context = Context({'tasks': tasks,'title':''})
        html_message = template.render(context)
        email = EmailMessage(subject, html_message, from_email, creator_dict[project])
        # email = EmailMessage(subject, html_message, from_email, [u.email])
        email.content_subtype = 'html'
        print(project,creator_dict[project])
        email.send()