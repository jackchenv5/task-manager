from django.urls import path, include
from rest_framework.routers import DefaultRouter
#from .views import ProjectViewSet, ProjectEvaluationViewSet
from .views import ProjectViewSet, ProjectEvaluationViewSet

# 创建路由器并自动生成URL路由
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'evaluations', ProjectEvaluationViewSet, basename='evaluation')

urlpatterns = [
    path('', include(router.urls)),
]

# 关键特性说明：
# ​​自动路由生成​​：
# 通过DefaultRouter自动为视图集生成标准RESTful路由
# 包含以下默认路由：
# /projects/ - GET(list), POST(create)
# /projects/{name}/ - GET(retrieve), PUT(update), PATCH(partial_update), DELETE(destroy)
# /projects/{name}/evaluations/ - GET(自定义action)
# /evaluations/ - GET(list), POST(create)
# /evaluations/recent/ - GET(自定义action)
# ​​配置细节​​：
# 使用basename参数确保反向解析URL时的命名唯一性
# DefaultRouter相比SimpleRouter额外提供API根视图
# 支持通过@action装饰器添加的自定义路由
