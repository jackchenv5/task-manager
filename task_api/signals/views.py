from rest_framework import viewsets
from .models import Signals
from .serializers import SignalSerializer

class SignalViewset(viewsets.ReadOnlyModelViewSet):
    """
    只读变更日志视图集，自动提供 list 和 retrieve 操作
    """
    queryset = Signals.objects.all().order_by('-timestamp')
    serializer_class = SignalSerializer
    filterset_fields = ['action', 'content_type']  # 可过滤字段
    search_fields = ['object_id', 'changed_fields']  # 可搜索字段