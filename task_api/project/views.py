# Create your views here.
from rest_framework import viewsets
from .models import Project, ProjectEvaluation
from .serializers import ProjectSerializer, ProjectEvaluationSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

from django_filters import rest_framework as filters

class ProjectFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')  # 支持模糊查询
    project_type = filters.CharFilter()  # 精确匹配
    
    class Meta:
        model = Project
        fields = ['name', 'project_type']


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-create_time')
    serializer_class = ProjectSerializer
    lookup_field = 'name'  # 使用name作为主键查找字段
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ProjectFilter  # 新增过滤器类

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, 
            data=request.data, 
            partial=True  # 关键参数，启用部分更新
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def evaluations(self, request, name=None):
        """获取项目所有评价"""
        project = self.get_object()
        evaluations = project.evaluations.all()
        serializer = ProjectEvaluationSerializer(evaluations, many=True)
        return Response(serializer.data)

class ProjectEvaluationViewSet(viewsets.ModelViewSet):
    queryset = ProjectEvaluation.objects.all()
    serializer_class = ProjectEvaluationSerializer

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """获取最近30天的评价"""
        recent_evaluations = self.get_queryset().filter(
            evaluation_time__gte=timezone.now()-timedelta(days=30)
        )
        serializer = self.get_serializer(recent_evaluations, many=True)
        return Response(serializer.data)