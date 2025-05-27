# Create your views here.
from rest_framework import viewsets
from .models import Project, ProjectEvaluation
from .serializers import ProjectSerializer, ProjectEvaluationSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django_filters import rest_framework as filters
from datetime import datetime, timedelta


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
        evaluations = ProjectEvaluation.objects.filter(project=project.name)
        serializer = ProjectEvaluationSerializer(evaluations, many=True)
        return Response(serializer.data)


class ProjectEvaluationFilter(filters.FilterSet):
    project = filters.CharFilter(lookup_expr='icontains')  # 支持模糊查询
    evaluation_type = filters.CharFilter(lookup_expr='icontains')  # 支持模糊查询
    evaluated_user = filters.NumberFilter(field_name="evaluated_user_id") 
    evaluator = filters.NumberFilter(field_name="evaluator_id") 
        # 支持用户名数组查询（前端传参格式：?usernames=user1,user2）
    usernames = filters.CharFilter(method='filter_by_usernames')
    # 支持年月过滤（前端传参格式：?year_month=2025-05）
    year_month = filters.CharFilter(method='filter_by_year_month')

    class Meta:
        model = ProjectEvaluation
        fields = ['evaluation_type','evaluated_user','evaluator','project','usernames','year_month']

    def filter_by_usernames(self, queryset, name, value):
        if not value:
            return queryset
            
        usernames = [u.strip() for u in value.split(',') if u.strip()]
        if not usernames:
            return queryset
            
        # 构建Q查询条件
        q_objects = Q()
        for username in usernames:
            q_objects |= Q(evaluated_user__username=username)
            
        return queryset.filter(q_objects)

    def filter_by_year_month(self, queryset, name, value):
        if not value:
            return queryset
            
        try:
            year, month = map(int, value.split('-'))
            start_date = datetime(year=year, month=month, day=1)
            
            # 计算下个月的第一天，然后减去1天得到本月的最后一天
            if month == 12:
                next_month = datetime(year=year+1, month=1, day=1)
            else:
                next_month = datetime(year=year, month=month+1, day=1)
                
            end_date = next_month - timedelta(days=1)
            
            return queryset.filter(
                evaluation_time__gte=start_date,
                evaluation_time__lte=end_date
            )
        except (ValueError, IndexError):
            return queryset

class ProjectEvaluationViewSet(viewsets.ModelViewSet):
    queryset = ProjectEvaluation.objects.all()
    serializer_class = ProjectEvaluationSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ProjectEvaluationFilter  # 新增过滤器类
    