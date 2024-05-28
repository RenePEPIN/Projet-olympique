from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from base.models import Product, Review
from base.serializers import ProductSerializer
from rest_framework import status


@api_view(['GET'])
def getProducts(request):
    """
    Récupère une liste paginée de produits filtrés par mot-clé.

    Parameters:
    request (Request): La requête HTTP.

    Returns:
    Response: Une réponse contenant une liste de produits et des informations de pagination.
    """
    query = request.query_params.get('keyword', '')

    products = Product.objects.filter(name__icontains=query).order_by('-createdAt')
    paginator = Paginator(products, 8)
    page = request.query_params.get('page')

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    page = int(page) if page else 1
    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})


@api_view(['GET'])
def getTopProducts(request):
    """
    Récupère les cinq meilleurs produits en fonction de leur note.

    Parameters:
    request (Request): La requête HTTP.

    Returns:
    Response: Une réponse contenant une liste des cinq meilleurs produits.
    """
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    """
    Récupère un produit spécifique par son ID.

    Parameters:
    request (Request): La requête HTTP.
    pk (int): L'ID du produit à récupérer.

    Returns:
    Response: Une réponse contenant les données du produit.
    """
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    """
    Crée un nouveau produit.

    Parameters:
    request (Request): La requête HTTP.

    Returns:
    Response: Une réponse contenant les données du produit créé.
    """
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        discipline='Sample Discipline',
        countInStock=0,
        category='Sample Category',
        description=''
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    """
    Met à jour un produit existant.

    Parameters:
    request (Request): La requête HTTP.
    pk (int): L'ID du produit à mettre à jour.

    Returns:
    Response: Une réponse contenant les données du produit mis à jour.
    """
    data = request.data
    product = Product.objects.get(_id=pk)
    product.name = data['name']
    product.price = data['price']
    product.discipline = data['discipline']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']
    product.save()
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    """
    Supprime un produit existant.

    Parameters:
    request (Request): La requête HTTP.
    pk (int): L'ID du produit à supprimer.

    Returns:
    Response: Une réponse indiquant que le produit a été supprimé.
    """
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product Deleted')


@api_view(['POST'])
def uploadImage(request):
    """
    Télécharge une image pour un produit existant.

    Parameters:
    request (Request): La requête HTTP.

    Returns:
    Response: Une réponse indiquant que l'image a été téléchargée.
    """
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)
    product.image = request.FILES.get('image')
    product.save()
    return Response('Image was uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    """
    Crée une nouvelle critique pour un produit spécifique.

    Parameters:
    request (Request): La requête HTTP.
    pk (int): L'ID du produit à critiquer.

    Returns:
    Response: Une réponse indiquant que la critique a été ajoutée ou une erreur le cas échéant.
    """
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = sum([i.rating for i in reviews])
        product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')
