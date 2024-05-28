from django.urls import path
from base.views import order_views as views

urlpatterns = [
    # URL pour obtenir toutes les commandes
    path('', views.getOrders, name='orders'),

    # URL pour ajouter des articles à une commande
    path('add/', views.addOrderItems, name='orders-add'),

    # URL pour obtenir les commandes de l'utilisateur connecté
    path('myorders/', views.getMyOrders, name='myorders'),

    # URL pour mettre à jour le statut de livraison d'une commande à l'aide de son identifiant
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name='order-delivered'),

    # URL pour obtenir les détails d'une commande à l'aide de son identifiant
    path('<str:pk>/', views.getOrderById, name='user-order'),

    # URL pour marquer une commande comme payée à l'aide de son identifiant
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
]
