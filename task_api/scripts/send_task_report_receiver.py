import os
import string
import sys
from datetime import datetime, timedelta
# 启动django
from pathlib import Path

import django

# Build paths inside the project like this: BASE_DIR / 'subdir'.
from django.db.models import Q

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


if __name__ == '__main__':
    # 进行中的任务
    today = datetime.today()
    current_month = today.month
    current_year = today.year
    tasks = Task.objects.filter(status_id=common.PROGRESS).order_by( 'receiver', 'start_time','project')
    tasks_reciever_dict = {}

    for task in tasks:
        reciver = task.receiver.username
        if reciver not in tasks_reciever_dict:
            tasks_reciever_dict[reciver] = []
        tasks_reciever_dict[reciver].append(task)

    # 生成 HTML 表格
    template_path = os.path.join(settings.BASE_DIR, 'templates/tasks/task_report_recevier.html')
    # 读取模板内容
    with open(template_path, 'r') as file:
        template_content = file.read()
    # 创建模板对象
    template = Template(template_content)
    from_email = 'scmsender@rd.maipu.com'  # 修改为你的发件人邮箱

    #通知执行者
    for user,tasks in tasks_reciever_dict.items():
        u = User.objects.get(username=user)
        # u = User.objects.get(username="陈成F")
        subject = '【任务系统-%s-任务反馈提醒】'% u.username
        context = Context({'tasks': tasks,'title':'进行中的任务'})
        html_message = template.render(context)
        email = EmailMessage(subject, html_message, from_email, [u.email])
        email.content_subtype = 'html'
        email.send()