
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # Web/Template views
    path('', views.home, name='home'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('profile/', views.profile_view, name='profile'),
    path('profile/edit/', views.edit_profile_view, name='edit_profile'),
    
    # API endpoints (keeping these for any AJAX functionality)
    path('api/register/', views.RegisterView.as_view(), name='api_register'),
    path('api/login/', views.api_login_view, name='api_login'),
    path('api/logout/', views.api_logout_view, name='api_logout'),
    path('api/user/', views.api_user_view, name='api_user'),
    path('api/profile/', views.ProfileViewSet.as_view({'get': 'list'}), name='api_profile_list'),
    path('api/profile/<int:pk>/', views.ProfileViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'}), name='api_profile_detail'),
]
