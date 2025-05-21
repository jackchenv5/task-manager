# logs/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.forms.models import model_to_dict
from django.contrib.contenttypes.models import ContentType
from .models import Signals

LOG_USER_FIELD_NAMES = ['creator', 'publisher', 'receiver','']


def get_user_from_instance(instance,change_files):
    return None


def get_changed_fields(instance):
    if not instance.pk:
        return {}
    model_class = instance.__class__
    try:
        old_instance = model_class.objects.get(pk=instance.pk)
        old_data = model_to_dict(old_instance)
        new_data = model_to_dict(instance)
        return {
            field: {'old': old_data.get(field), 'new': new_data.get(field)}
            for field in new_data if new_data[field] != old_data.get(field)
        }
    except model_class.DoesNotExist:
        return {}

@receiver(post_save)
def log_save(sender, instance, created, **kwargs):
    if not should_log_model(sender):
        return

    action = 'created' if created else 'updated'
    changed_fields = None
    old_values = None
    new_values = None

    if not created:
        changed_fields = get_changed_fields(instance)
        old_values = {k: v['old'] for k, v in changed_fields.items()}
        new_values = {k: v['new'] for k, v in changed_fields.items()}

    Signals.objects.create(
        content_type=ContentType.objects.get_for_model(instance),
        object_id=str(instance.pk),  # 强制转为字符串
        action=action,
        user=get_user_from_instance(instance,changed_fields),
        changed_fields=list(changed_fields.keys()) if changed_fields else None,
        old_values=old_values,
        new_values=new_values
    )

@receiver(post_delete)
def log_delete(sender, instance, **kwargs):
    if not should_log_model(sender):
        return

    Signals.objects.create(
        content_type=ContentType.objects.get_for_model(instance),
        object_id=str(instance.pk),  # 强制转为字符串
        action='deleted',
        user=getattr(instance, 'user', None),
        old_values=model_to_dict(instance)
    )

def should_log_model(model):
    # 添加需要监控的模型，例如：
    from task_api.task.models import Task
    from project.models import ProjectEvaluation
    return model in [Task, ProjectEvaluation]