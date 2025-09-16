import os
import string
import sys
from datetime import datetime
# 启动django
from pathlib import Path

import django

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'task_api.settings')
django.setup()
from django.conf import settings
from django.template.loader import get_template
from django.contrib.auth import get_user_model  # 导入Django的用户模型
from task.models import Task
import  common

import pickle

User = get_user_model()

from django.core.mail import EmailMessage
from django.template import Template, Context

if __name__ == '__main__':
    # 进行中的任务
    tasks = Task.objects.all()
    print(tasks.count()) 
    with open('data.pickle', 'wb') as f:
        pickle.dump(list(tasks), f)
