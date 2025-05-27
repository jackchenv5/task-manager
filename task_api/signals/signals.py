# logs/signals.py
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from common.utils import custom_model_to_dict
from django.contrib.contenttypes.models import ContentType

from task.serializers import TaskSerializer
from project.serializers import ProjectEvaluationSerializer
from .models import Signals
import json
from task.models import Task
from project.models import ProjectEvaluation
from threadlocals.threadlocals import get_current_request

def get_user_for_instance():
    request = get_current_request()
    if request:
        user_id = request.META.get('HTTP_X_USER_ID','')  # 从请求头获取
        if user_id:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                return User.objects.get(id=user_id)
            except User.DoesNotExist:
                pass
    return None

def should_log_model(model):
    # 添加需要监控的模型，例如：
    return model in [Task, ProjectEvaluation]

def get_changed_fields(instance):

    model_class = instance.__class__
    old_instance = model_class.objects.get(pk=instance.pk)
    old_data = custom_model_to_dict(old_instance)
    new_data = custom_model_to_dict(instance)
    return {
        field: {'old': old_data.get(field), 'new': new_data.get(field)}
        for field in new_data if new_data[field] != old_data.get(field)
    }

def get_serializers_data(instance):
    model_class = instance.__class__
    if model_class == Task:
        serializer = TaskSerializer(instance)
    elif model_class == ProjectEvaluation:
        serializer = ProjectEvaluationSerializer(instance)
    else:
        serializer = None
    return serializer.data
@receiver(pre_save)
def log_pre_save(sender, instance, **kwargs):
        if not should_log_model(sender):
            return
        # 存储到实例属性中供post_save使用
        action = 'updated'
        if instance.pk is None:
            action = 'created'
        user=get_user_for_instance()

        if action == 'created':
            title,conent = instance.get_signal_log(action,user)
            # 使用 TaskSerializer 序列化为 JSON
            data = get_serializers_data(instance)
            Signals.objects.create(
                content_type=ContentType.objects.get_for_model(instance),
                object_id=str(instance.pk),  # 强制转为字符串
                action=action,
                user=user,
                title=title,
                content=conent,
                project=instance.project,
                changed_fields=data
            )
        else:
            changed_fields = get_changed_fields(instance)
            title,conent = instance.get_signal_log(action,user,changed_fields)
            Signals.objects.create(
                content_type=ContentType.objects.get_for_model(instance),
                object_id=str(instance.pk),  # 强制转为字符串
                action=action,
                user=user,
                title=title,
                content=conent,
                project=instance.project,
                changed_fields=json.dumps(changed_fields)
            )


@receiver(post_delete)
def log_delete(sender, instance, **kwargs):
    if not should_log_model(sender):
        return
    action='deleted'
    user=get_user_for_instance()
    title,conent = instance.get_signal_log(action,user)
    serializer = TaskSerializer(instance)
    json_data = serializer.data  # 返回字典格式的序列化数据
    Signals.objects.create(
        content_type=ContentType.objects.get_for_model(instance),
        object_id=str(instance.pk),  # 强制转为字符串
        action=action,
        user=user,
        title=title,
        content=conent,
        project=instance.project,
        changed_fields=json_data
    )

