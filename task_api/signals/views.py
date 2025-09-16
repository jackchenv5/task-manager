from rest_framework import viewsets
from .models import Signals
from .serializers import SignalSerializer
from django_filters import rest_framework as filters

class SignalFilter(filters.FilterSet):
    timestamp = filters.DateTimeFilter(field_name="timestamp", lookup_expr='gte')
    project = filters.CharFilter(lookup_expr='icontains')  # 支持模糊查询
    title = filters.CharFilter(lookup_expr='icontains')  # 支持模糊查询
    user = filters.NumberFilter(field_name="user_id")  # 假设receiver是一个关联到User的外键
    group = filters.NumberFilter(method="filter_group")
    class Meta:
        model = Signals
        fields = ['action', 'project','user','timestamp','title','group']

    def filter_group(self,queryset,name,value):

        if value and name == "group":
            from user.models import  Group
            from django.db.models import Q
            g = Group.objects.get(id=value)
            q_objects = Q()
            for u in g.users.values_list('username',flat=True):
                q_objects |= Q(title__icontains=u)
            return queryset.filter(q_objects)

class SignalViewset(viewsets.ReadOnlyModelViewSet):
    """
    只读变更日志视图集，自动提供 list 和 retrieve 操作
    """
    queryset = Signals.objects.all().order_by('-timestamp')
    serializer_class = SignalSerializer
    lookup_field = 'project'  
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = SignalFilter  # 新增过滤器类