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
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), required=False)
    evaluator = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    evaluated_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = ProjectEvaluation
        fields = [
            'id',
            'project',
            'evaluated_user',
            'evaluator',
            'evaluation_type',
            'score',
            'comment',
            'evaluation_time',
            'created_time'
        ]
        read_only_fields = ['created_time']