from django.urls import path
from base.views import product_views as views

urlpatterns = [

    path('', views.getProducts, name="products"),
    # URL pour obtenir la liste de tous les produits.

    path('create/', views.createProduct, name="product-create"),
    # URL pour créer un nouveau produit.

    path('upload/', views.uploadImage, name="image-upload"),
    # URL pour télécharger une image associée à un produit.

    path('<str:pk>/reviews/', views.createProductReview, name="create-review"),
    # URL pour créer une critique pour un produit spécifique identifié par son ID.

    path('top/', views.getTopProducts, name='top-products'),
    # URL pour obtenir la liste des meilleurs produits.

    path('<str:pk>/', views.getProduct, name="product"),
    # URL pour obtenir les détails d'un produit spécifique identifié par son ID.

    path('update/<str:pk>/', views.updateProduct, name="product-update"),
    # URL pour mettre à jour les détails d'un produit spécifique identifié par son ID.

    path('delete/<str:pk>/', views.deleteProduct, name="product-delete"),
    # URL pour supprimer un produit spécifique identifié par son ID.
]
