#!/usr/bin/env python
import django
import os 
import sys

#启动django
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0,BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'task_api.settings')
django.setup()

# 初始化 Gramularity

from task.models import Granularity,JobStatus,TaskCategory,TaskStatus,Tag
from user.models import Group,User
# group_list =['组1','组2','组3']
# granularity_list = ['周','两周','月']
# job_status_list = ['活跃','不活跃']
# task_categrory_list =['项目','非项目','Feature']
task_status_list = ['未发布','已发布','草稿','进行中']
tag_list = [['高','red'],['中','green'],['低','yellow']]

def initData(data,model):
    for i in data:
        if isinstance(i,list):
            if model == Tag :
              obj = Tag(name=i[0],color=i[1])
        else:
            obj = model(name=i)
        obj.save()

#初始化
init_list = [[group_list,Group],[granularity_list,Granularity],[job_status_list,JobStatus],[task_categrory_list,TaskCategory],[task_status_list,TaskStatus],[tag_list,Tag]]
for tmp_list in init_list:
    initData(tmp_list[0],tmp_list[1])


#初始化用户
#User.objects.create_superuser(username='admin', email='myuser@example.com', password='123.com').save()
User.objects.create_user(username='test1', email='myuser@example.com', password='123.com',).save()
User.objects.create_user(username='test2', email='myuser@example.com', password='123.com',).save()
User.objects.create_user(username='test3', email='myuser@example.com', password='123.com',).save()


