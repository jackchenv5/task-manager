# myapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SignalViewset  # 假设已创建视图集

# 实例化默认路由器
router = DefaultRouter()  # 可选：禁用URL末尾斜杠

# 注册视图集（自动生成标准RESTful路由）
router.register(r'logs', SignalViewset, basename='singal-log')

urlpatterns = [
    # 包含自动生成的路由
    path('', include(router.urls)),
    
    # 可添加其他自定义路由（如有）
    # path('custom/', custom_view),
]