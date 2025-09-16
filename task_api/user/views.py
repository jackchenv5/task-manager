import re
from rest_framework import generics
from user.serializers import UserSerializer,GroupSerializer,RoleSerializer
from django.contrib.auth import get_user_model
User = get_user_model()
from user.models import Role,Group
from rest_framework import viewsets
from rest_framework.views import APIView  

from rest_framework.pagination import PageNumberPagination  
from rest_framework.response import Response 
from rest_framework import status  
from django_filters import rest_framework as filters
from django.db.models import Q
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
class UserFilter(filters.FilterSet):
    text = filters.CharFilter(method='filter_text', label='Search text')

    class Meta:
        model = User
        fields = ['username', 'emp_num']  # 这些字段将支持标准的过滤

    def filter_text(self, queryset, name, value):
        # 这里可以根据你的需求来实现更复杂的搜索逻辑
        # 这里只是一个简单的示例，它会在 username 和 emp_num 上执行不区分大小写的搜索
        return queryset.filter(
            Q(username__icontains=value) |
            Q(role__name__icontains=value) |
            Q(emp_num__icontains=value)
        )

class GroupFilter(filters.FilterSet):
    text = filters.CharFilter(method='filter_text', label='Search text')
    class Meta:
        model = Group
        fields = ['name']  # 这些字段将支持标准的过滤

    def filter_text(self, queryset, name, value):
        # 这里可以根据你的需求来实现更复杂的搜索逻辑
        return queryset.filter(name__icontains=value)

class StandardPagination(PageNumberPagination):  
    page_size_query_param = 'pageSize'  # 允许客户端通过查询参数来覆盖默认设置


class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.hello
    """
    queryset = User.objects.all()
    pagination_class = StandardPagination
    serializer_class = UserSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = UserFilter

    @action(detail=False, methods=['get'], url_path='get_by_username/(?P<username>\w+)')
    def get_by_username(self, request, username=None):
        user = get_object_or_404(self.get_queryset(), username=username)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def check_login(self, request, username=None):
        return Response({'id':608,'name':'陈成F'})
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return Response({
                'code': 0,
                'message': 'ok',
                 'result': {
                    'items': serializer.data,
                    'total': queryset.count(),  # 这里获取总条目数
                },
                'type': 'success',
            })

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'code': 0,
            'message': 'ok',  # 或者你可以自定义没有数据的消息
            'result': {
                    'items': serializer.data,
                    'total': queryset.count(),  # 这里获取总条目数
             },
            'type': 'success',
        })

class RoleViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    pagination_class = StandardPagination

    def list(self, request, *args, **kwargs):  
        queryset = self.filter_queryset(self.get_queryset())  
  
        page = self.paginate_queryset(queryset)  
        if page is not None:  
            serializer = self.get_serializer(page, many=True)  
            return Response({  
                'code': 0,  
                'message': 'ok',  
                 'result': {  
                    'items': serializer.data,  
                    'total': queryset.count(),  # 这里获取总条目数  
                },   
                'type': 'success',  
            })  
  
        serializer = self.get_serializer(queryset, many=True)  
        return Response({  
            'code': 0,  
            'message': 'ok',  # 或者你可以自定义没有数据的消息
            'result': {  
                    'items': serializer.data,  
                    'total': queryset.count(),  # 这里获取总条目数  
             },  
            'type': 'success',  
        })

class GroupViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.hello
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    pagination_class = StandardPagination
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = GroupFilter

    # def list(self, request, *args, **kwargs):
    #     queryset = self.filter_queryset(self.get_queryset()).order_by('-id')
    #     empty_group = [{'id': 0, 'name': '', 'users': []}]
    #     page = self.paginate_queryset(queryset)
    #     if page is not None:
    #         serializer = self.get_serializer(page, many=True)
    #         return Response({
    #             'code': 0,
    #             'message': 'ok',
    #              'result': {
    #                 'items':serializer.data ,
    #                 'total': queryset.count(),  # 这里获取总条目数
    #             },
    #             'type': 'success',
    #         })
    #
    #     serializer = self.get_serializer(queryset, many=True)
    #     return Response({
    #         'code': 0,
    #         'message': 'No data',  # 或者你可以自定义没有数据的消息
    #         'result': {
    #                 'items': serializer.data ,
    #                 'total': queryset.count(),  # 这里获取总条目数
    #          },
    #         'type': 'success',
    #     })

class UserIDsByUsernamesAPIView(APIView):  
    def get(self, request, usernames, format=None):  
        # 分割用户名列表  
        username_list = re.split(r'[，,]', usernames)  
        # 移除空白字符并转换为小写（如果需要）  
        username_list = [username.strip() for username in username_list]  
          
        # 查找用户ID  
        user_ids = []  
        for username in username_list:  
            try:  
                user = User.objects.get(username=username)  
                user_ids.append(user.id)  
            except User.DoesNotExist:  
                # 你可以选择记录错误或忽略不存在的用户  
                pass  
  
        # 返回用户ID列表  
        return Response(user_ids, status=status.HTTP_200_OK)