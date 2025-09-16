#!/usr/bin/env python
import django
import os 
import sys
import requests  

#启动django
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0,BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'task_api.settings')
django.setup()

from project.models import Project

from django.contrib.auth import get_user_model  # 导入Django的用户模型  
User = get_user_model()
post_url = 'http://128.255.125.12:8008/api/project'  

u = User.objects.get(id=608)
#将当前任务系统中的项目任务导入项目列表中
data={
    'method': 'get_list',
}

response = requests.post(post_url, data=data)
project_data = response.json()
for project_info in project_data:
    name=project_info.get('name')
    auth=project_info.get('author')
    pq=Project.objects.filter(name=name)
    if pq.count() > 0:
        continue
    newProjectObj = Project(name=name,owner=u)
    newProjectObj.save()
    print(f'{name}:{auth} added!')
    
    
