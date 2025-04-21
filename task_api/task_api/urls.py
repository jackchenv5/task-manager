from django.urls import path, include

urlpatterns = [
    path('api/', include('task.urls')),
    path('api/', include('user.urls')),
    path('api-auth/', include('rest_framework.urls')),
]