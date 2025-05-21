from django.urls import path, include

urlpatterns = [
    path("api/", include("signals.urls")),  # 新增logs路由
    path("api/", include("project.urls")),  # 新增项目路由
    path("api/", include("task.urls")),
    path("api/", include("user.urls")),
    path("api-auth/", include("rest_framework.urls")),
]
