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


#将当前任务系统中的项目任务导入项目列表中

from task.models import Task

taskQuerySet = Task.objects.all()

from project.models import Project
for taskObj in taskQuerySet:
    project = taskObj.project
    own = taskObj.creator
    if not own:
        continue
    if not project:
        continue
    projectQuerySet = Project.objects.filter(name=project)
    if projectQuerySet.count() > 0:
        print(f'{project} exits!')
        continue
    newProjectObj = Project(name=project,owner=own)
    newProjectObj.save()
     
    
