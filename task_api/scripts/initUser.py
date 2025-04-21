import requests  
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
from django.contrib.auth import get_user_model  # 导入Django的用户模型  
from user.models import Role
  
User = get_user_model()
# 你的API细节  
post_url = 'http://128.255.125.225/api/get_user_list'  
  
# 假设API直接返回用户列表，不需要额外的参数  
response = requests.get(post_url)  # 假设API支持GET请求  
  
# 检查响应状态码  
if response.status_code == 200:  
    user_data = response.json()  # 解析JSON响应  
  
    # 遍历用户数据  
    for user_dict in user_data:  
        # Django的User模型可能不包含所有字段，你可能需要自定义模型或使用User的profile
        id = user_dict.get('id')
        username = user_dict.get('name')
        email = "%s@rd.maipu.com" % user_dict.get('nick')
        emp_num = user_dict.get('uid')
        role = user_dict.get('role')
        depart = user_dict.get('depart')
        login_ip = user_dict.get('last_login_ip')
        #软件测试部人员
        if depart not in ["软件测试部","项目管理与运营支撑部"]:
            continue
        # 创建或更新用户  
        try:  
            # 尝试获取已存在的用户  
            user = User.objects.get(id=id)
            # 在这里，你可以更新用户的字段，比如使用`user.save()`保存更改  
            print(f"User {username} already exists.")
        except User.DoesNotExist:  
            # 如果用户不存在，则创建新用户
            role_obj,_ = Role.objects.get_or_create(name="执行人员")
            user = User.objects.create_user(id=id,username=username, email=email,emp_num=emp_num,role=role_obj,depart=depart,login_ip=login_ip)
            print(f"Created user: {username}:{id}:{depart}:{role}")
  
        # 如果你有自定义的用户模型（如CustomUser），你需要使用相应的逻辑来创建或更新它  
  
# 如果响应状态码不是200，则处理错误  
else:  
    print(f"Error fetching user data: {response.status_code}")  
    print(response.text)
