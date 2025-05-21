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
    # content_type_name = serializers.SerializerMethodField()
    # content_object_str = serializers.SerializerMethodField()
    # user_username = serializers.SerializerMethodField()

    class Meta:
        model = Signals
        fields = '__all__'
        # extra_kwargs = {
        #     'content_type': {'write_only': True},  # 内容类型仅用于写入
        #     'object_id': {'write_only': True}      # 对象ID仅用于写入
        # }