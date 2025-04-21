from django.urls import path
from task.views import TaskStatusViewSet,TaskCategoryViewSet,\
    TaskViewSet,NotifyTasksByReceiverAPI,ExportExcel,ReportTask,ExportTestExcel,ImportExcel,ExportTemplateExcel
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Create a router and register our ViewSets with it.
router = DefaultRouter()
router.register(r'task_status', TaskStatusViewSet, basename='task_status')
router.register(r'task_category', TaskCategoryViewSet, basename='task_category')
router.register(r'tasks', TaskViewSet, basename='task')


urlpatterns = [
    path('', include(router.urls)),
    path('task/export/', ExportExcel.as_view(), name='tasks-export'),
    path('task/report/', ReportTask.as_view(), name='tasks-report'),
    path('task/export_test/', ExportTestExcel.as_view(), name='tasks-export'),
    path('task/import/<int:userid>/', ImportExcel.as_view(), name='tasks-import'),
    path('task/notify-tasks-by-receiver/', NotifyTasksByReceiverAPI.as_view(), name='notify-tasks-by-receiver'),
    path('task/export_template/', ExportTemplateExcel.as_view(), name='tasks-template-export'),
]