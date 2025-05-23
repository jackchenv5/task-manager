from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.utils import timezone

User = get_user_model()

class Signals(models.Model):
    """
    通用变更日志模型，支持记录任意模型的增删改操作。
    """
    ACTION_CHOICES = (
        ('created', '新增'),
        ('updated', '修改'),
        ('deleted', '删除'),
    )

    # 关联的模型
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.CharField(max_length=255)  # 改为 CharField
    content_object = GenericForeignKey('content_type', 'object_id')

    # 操作信息
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    # 操作人员,由前端axios HEADER传递
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)  # 操作用户
    timestamp = models.DateTimeField(default=timezone.now)

    # # 变更详情
    changed_fields = models.JSONField(null=True, blank=True)  # 修改的字段
    
    #关联项目
    project = models.CharField(max_length=128, null=True,blank=True)
    
    # 日志内容
    title = models.CharField(max_length=128, null=True, blank=True)
    content = models.CharField(max_length=1024, null=True, blank=True)

    class Meta:
        verbose_name = '变更日志'
        verbose_name_plural = '变更日志'
        ordering = ['-timestamp']  # 按时间倒序排列

    def __str__(self):
        return f"[{self.action}] {self.content_type.model}:{self.object_id} @ {self.timestamp}"

    def get_content_object(self):
        """
        安全获取关联对象，兼容字符串/整数主键
        """
        try:
            model_class = self.content_type.model_class()
            if not model_class:
                return None
            
            # 获取主键字段名（如 id 或 name）
            pk_field = model_class._meta.pk.name
            
            # 如果主键字段是字符串类型（如 CharField），使用 object_id 直接查询
            if isinstance(model_class._meta.get_field(pk_field), models.CharField):
                return model_class.objects.filter(**{pk_field: self.object_id}).first()
            
            # 否则尝试转换为整数
            return model_class.objects.get(pk=int(self.object_id))
        except (model_class.DoesNotExist, ValueError):
            return None