from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Project, ProjectEvaluation

User = get_user_model()

from user.serializers import UserSerializer

class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Project
        fields = [
            'name', 
            'owner', 
            'project_type', 
            'create_time', 
        ]
        read_only_fields = ['create_time']

class ProjectEvaluationSerializer(serializers.ModelSerializer):
    evaluator = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    evaluated_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
        # 新增：年月格式字段（只读）
    evaluation_year_month = serializers.SerializerMethodField(read_only=True)

    evaluated_user_username = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProjectEvaluation
        fields = [
            'id',
            'project',
            'evaluated_user',
            'evaluated_user_username',
            'evaluator',
            'evaluation_type',
            'score',
            'comment',
            'evaluation_time',
            'evaluation_year_month',  # 新增字段
            'created_time'
        ]
        read_only_fields = ['created_time']

    def get_evaluation_year_month(self, obj):
        """返回格式化的年月字符串"""
        return obj.evaluation_time.strftime('%Y-%m') if obj.evaluation_time else None
    
    def get_evaluated_user_username(self, obj):
        """返回被评价人的用户名"""
        return obj.evaluated_user.username if obj.evaluated_user else None