from django.urls import path
from base.views import user_views as views

urlpatterns = [
    # Vue pour l'obtention d'une paire de jetons d'authentification
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Vue pour l'enregistrement d'un nouvel utilisateur
    path('register/', views.registerUser, name='register'),

    # Vue pour obtenir le profil de l'utilisateur
    path('profile/', views.getUserProfile, name="users-profile"),

    # Vue pour mettre à jour le profil de l'utilisateur
    path('profile/update/', views.updateUserProfile, name="user-profile-update"),

    # Vue pour obtenir la liste de tous les utilisateurs
    path('', views.getUsers, name="users"),

    # Vue pour obtenir un utilisateur par son identifiant
    path('<str:pk>/', views.getUserById, name='user'),

    # Vue pour mettre à jour un utilisateur par son identifiant
    path('update/<str:pk>/', views.updateUser, name='user-update'),

    # Vue pour supprimer un utilisateur par son identifiant
    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
]
