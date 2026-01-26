import pandas
from rest_framework import serializers
from django.contrib.auth import get_user_model

from common.utils import workdays_between_with_holidays
from user.models import Group
import  common
User = get_user_model()

from task.models import TaskStatus,TaskCategory,Tag,Task
class TaskStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskStatus
        fields = ['id', 'name']

class TaskCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCategory
        fields = ['id', 'name']

class TaskSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=TaskCategory.objects.all(), required=False)
    creator = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    publisher = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    start_time = serializers.DateField(format='%Y-%m-%d',allow_null=True,required=False)
    create_time = serializers.DateField(format='%Y-%m-%d',allow_null=True,required=False)
    deadline_time = serializers.DateField(format='%Y-%m-%d',allow_null=True,required=False)
    # feedback_time = serializers.DateTimeField(format='%Y-%m-%d',allow_null=True,required=False)
    # category_name = serializers.SerializerMethodField(required=False)
    category_name = serializers.CharField(source='category.name', read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)

    creator_name = serializers.CharField(source='creator.username', read_only=True)
    receiver_name = serializers.CharField(source='receiver.username', read_only=True)
    publisher_name = serializers.CharField(source='publisher.username', read_only=True)

    # creator_name = serializers.SerializerMethodField(required=False)
    # receiver_name = serializers.SerializerMethodField(required=False)

    # publisher_name = serializers.SerializerMethodField(required=False)
    # status_name = serializers.SerializerMethodField(required=False)
    # related_task_name = serializers.SerializerMethodField(required=False)
    # workload_intensity = serializers.SerializerMethodField()
    diff_days = serializers.SerializerMethodField()
    # workloads = serializers.SerializerMethodField()
    description  = serializers.CharField(required=False,allow_null=True, allow_blank=True, default="")
    content  = serializers.CharField(required=False,allow_null=True, allow_blank=True, default="")
    feedback  = serializers.CharField(required=False,allow_null=True, allow_blank=True, default="")
    challenge  = serializers.CharField(required=False,allow_null=True, allow_blank=True, default="")
    project  = serializers.CharField(required=False,allow_null=True, allow_blank=True, default="")
    sender  = serializers.CharField(required=False,allow_null=True, allow_blank=True, default="")
    class Meta:
            model = Task
            fields = ['id','name','content','challenge','feedback','creator','receiver','create_time',
                      'start_time','deadline_time','description','sender','workload','act_workload','progress',
                      'status','project',
                      'creator_name','receiver_name','status_name','publisher','publisher_name',
                      'diff_days','category','category_name',
                      # 'done_time','feedback_time',
                      # ,''category'','category_name','related_task_name','related_task'
                      # 'workload_intensity',,'workloads'
                      ]
    def get_diff_days(self, obj):
        # 这里你需要传递receiver_id, start_date, end_date
        if not obj.start_time or not obj.deadline_time:
            return 0
        days_difference =  workdays_between_with_holidays(obj.start_time,obj.deadline_time)
        return days_difference

    # def get_workloads(self, obj):
    #     # 这里你需要传递receiver_id, start_date, end_date
    #     if not obj.start_time or not obj.deadline_time:
    #         return 0
    #     return Task.calculate_workload_intensity(obj.receiver_id, obj.start_time, obj.deadline_time)



    # def get_workload_intensity(self, obj):
    #     # 这里你需要传递receiver_id, start_date, end_date
    #     #不在统计范围的任务不统计
    #     if (not obj.status) or (obj.status.name not in common.TASK_STATUS_FOR_WORKLOAD):
    #         return 0
    #     #创建任务时，开始结束时间可能为空
    #     if (not obj.start_time) or (not obj.deadline_time):
    #         return 0
    #     days_difference = workdays_between_with_holidays(obj.start_time,obj.deadline_time)
    #     if days_difference == 0:
    #         return 0
    #     workloads =  Task.calculate_workload_intensity(obj.receiver_id, obj.start_time, obj.deadline_time)
    #     get_workload_intensity = int(100 * workloads / days_difference)
    #     return get_workload_intensity

    def get_status_name(self, obj):
        if obj.status is not None:
            return obj.status.name
        return '未指定'  # 或者你想要的任何默认值

    def get_category_name(self, obj):
        if obj.category is not None:
            return obj.category.name
        return '未指定'  # 或者你想要的任何默认值

    def get_creator_name(self, obj):
        if obj.creator is not None:
            return obj.creator.username
        return '未指定'  # 或者你想要的任何默认值

    def get_receiver_name(self, obj):
        if obj.receiver is not None:
            return obj.receiver.username
        return '未指定'  # 或者你想要的任何默认值
    def get_publisher_name(self, obj):
        if obj.publisher is not None:
            return obj.publisher.username
        return '未指定'  # 或者你想要的任何默认值

    def get_related_task_name(self, obj):
        if obj.related_task is not None:
            return obj.related_task.name
        return '未指定'  # 或者你想要的任何默认值
