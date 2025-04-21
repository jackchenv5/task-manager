import argparse
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
from user.models import Group


def get_current_week_range():
    today = datetime.now()  # 获取当前时间，并指定为UTC时区
    start_of_week = today - timedelta(days=today.weekday())  # 获取本周一
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_week = start_of_week + timedelta(days=6, hours=23, minutes=59, seconds=59)  # 获取本周日的最后一秒

    return start_of_week, end_of_week

if __name__ == '__main__':
    # 进行中的任务
    parser = argparse.ArgumentParser(description='group report...')
    parser.add_argument('--user', type=str,help='user name')
    args = parser.parse_args()

    #获取组和员工的映射
    group_email_dict = {}
    for group in Group.objects.all():
        group_leader = group.group_leader
        if group_leader:
            group_leader_email = User.objects.get(username=group_leader).email
        for u in group.users.all():
            u_name = u.username
            if u_name not in group_email_dict:
                group_email_dict[u_name] = {'group_leader_email':[],'depart_leader_email':[]}
            if group_leader_email not in group_email_dict[u_name]['group_leader_email']:
                group_email_dict[u_name]['group_leader_email'].append(group_leader_email)

    today = datetime.today()
    current_month = today.month
    current_year = today.year
    start_of_week, end_of_week = get_current_week_range()
    print(start_of_week,end_of_week)
    # 使用Q对象组合条件，确保任务的start_time或deadline_time落在当前周内
    tasks = Task.objects.filter(start_time__gte=start_of_week,deadline_time__lte=end_of_week,status_id__in=[common.PROGRESS,common.FINISH]).order_by('receiver','status', 'start_time','project')
    #tasks = Task.objects.filter(start_time__year=current_year, start_time__month=current_month,status_id__in=[common.PROGRESS,common.FINISH]).order_by('receiver','status', 'start_time','project')
    tasks_group_dict = {}

    for task in tasks:
        if not task.receiver:
            continue
        receiver_username = task.receiver.username
        receiver_of_group = group_email_dict[receiver_username]['group_leader_email']
        for group_email in receiver_of_group:
            if group_email not in tasks_group_dict:
                tasks_group_dict[group_email] = []
            tasks_group_dict[group_email].append(task)
    # 生成 HTML 表格
    template_path = os.path.join(settings.BASE_DIR, 'templates/tasks/task_report_group.html')
    # 读取模板内容
    with open(template_path, 'r') as file:
        template_content = file.read()
    # 创建模板对象
    template = Template(template_content)
    from_email = 'scmsender@rd.maipu.com'  # 修改为你的发件人邮箱
    #通知执行者
    for group_email,tasks in tasks_group_dict.items():
        # u = User.objects.get(username=user)
        # print(group_email)
        u = User.objects.get(email=group_email).username
        if args.user:
            #传了当前用户
            arg_group_leader = Group.objects.filter(group_leader=args.user)
            #当前用户为处长
            arg_depart_groups = Group.objects.filter(depart_leader=args.user)
            #处长有值，获取处长的组长
            if arg_depart_groups:
                d_of_g =  [g.group_leader for g in arg_depart_groups]
                #组长不在此处长的列表中，跳过
                if u not in d_of_g:
                    continue

            # 组长有值,组长和当前组不相同，跳过
            if arg_group_leader and u != args.user:
                continue

        groups = Group.objects.filter(group_leader=u)
        group_names = list(set([g.name for g in groups]))
        #处长email
        depart_names = list(set([g.depart_leader for g in groups]))
        depart_emails = [User.objects.get(username=i).email for i in depart_names ]
        # u = User.objects.get(username="陈成F")
        print('group_email,depart_emails',group_email,depart_emails)
        subject = '【任务系统-%s-测试周报】'% "|".join(group_names)
        context = Context({'tasks': tasks,'title':''})
        html_message = template.render(context)
        email = EmailMessage(subject, html_message, from_email, [group_email],cc=depart_emails)
        email.content_subtype = 'html'
        email.send()