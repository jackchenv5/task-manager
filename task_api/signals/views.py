from rest_framework import viewsets
from .models import Signals
from .serializers import SignalSerializer
from django_filters import rest_framework as filters

class SignalFilter(filters.FilterSet):
    timestamp = filters.DateTimeFilter(field_name="timestamp", lookup_expr='gte')
    project = filters.CharFilter(lookup_expr='icontains')  # 支持模糊查询
    user = filters.NumberFilter(field_name="user_id")  # 假设receiver是一个关联到User的外键
    
    class Meta:
        model = Signals
        fields = ['action', 'project','user','timestamp']


class SignalViewset(viewsets.ReadOnlyModelViewSet):
    """
    只读变更日志视图集，自动提供 list 和 retrieve 操作
    """
    queryset = Signals.objects.all().order_by('-timestamp')
    serializer_class = SignalSerializer
    lookup_field = 'project'  
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = SignalFilter  # 新增过滤器类