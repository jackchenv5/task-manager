# Create your views here.
from rest_framework import viewsets
from .models import Project, ProjectEvaluation
from .serializers import ProjectSerializer, ProjectEvaluationSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'name'  # 使用name作为主键查找字段

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