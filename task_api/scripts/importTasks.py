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

def import_from_pickle(file_path):
    """
    从 pickle 文件导入数据到数据库
    """
    try:
        with open(file_path, 'rb') as f:
            data = pickle.load(f)
            
            # 如果导出时使用了直接序列化 QuerySet
            if isinstance(data, list) and len(data) > 0 and isinstance(data[0], Task):
                for item in data:
                    # 创建新实例或更新现有记录
                    item.save()
                    print(item.name)
                    #obj, created = MyModel.objects.update_or_create(
                    #    defaults={
                    #        'field1': item.field1,
                    #        'field2': item.field2,
                    #        # 其他字段...
                    #    }
                    #)
                return f"成功导入 {len(data)} 条记录"
                
    except FileNotFoundError:
        return "文件未找到"
    except Exception as e:
        return f"导入失败: {str(e)}"

if __name__ == '__main__':
    # 进行中的任务
    import_from_pickle('data.pickle')
