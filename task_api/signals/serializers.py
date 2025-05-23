from rest_framework import serializers
from .models import Signals
from django.contrib.contenttypes.models import ContentType

class SignalSerializer(serializers.ModelSerializer):
    """
    变更日志序列化器，支持以下功能：
    1. 自动序列化所有模型字段
    2. 显示关联对象的字符串表示
    3. 自定义内容类型名称展示
    """
    content_type_name = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')  # 自动解析

    class Meta:
        model = Signals
        fields = '__all__'
    def get_content_type_name(self, obj):
        """返回内容类型的完整名称（如 'task.Task'）"""
        return f"{obj.content_type.app_label}"