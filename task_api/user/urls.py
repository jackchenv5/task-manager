from django.urls import path, include
from user.views import UserViewSet,RoleViewSet,GroupViewSet,UserIDsByUsernamesAPIView 
from rest_framework.routers import DefaultRouter

# Create a router and register our ViewSets with it.
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'groups', GroupViewSet, basename='group')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('users/ids/by_usernames/<str:usernames>/', UserIDsByUsernamesAPIView.as_view(), name='user-ids-by-usernames'), 
]