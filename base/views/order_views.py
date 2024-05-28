from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer
from rest_framework import status
from datetime import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    """
    Cette vue permet d'ajouter des articles à une commande.

    Args:
        request: L'objet de requête HTTP.

    Returns:
        Réponse HTTP avec les données de la commande nouvellement créée.
    """
    user = request.user
    data = request.data
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # (1) Créer une commande
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # (2) Créer une adresse de livraison
        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        # (3) Créer des articles de commande et définir la relation commande-article
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])
            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url,
            )
            # (4) Mettre à jour le stock
            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    """
    Cette vue récupère les commandes de l'utilisateur connecté.

    Args:
        request: L'objet de requête HTTP.

    Returns:
        Réponse HTTP avec les données des commandes de l'utilisateur.
    """
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    """
    Cette vue récupère toutes les commandes (pour les administrateurs).

    Args:
        request: L'objet de requête HTTP.

    Returns:
        Réponse HTTP avec les données de toutes les commandes.
    """
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    """
    Cette vue récupère une commande spécifique par son ID.

    Args:
        request: L'objet de requête HTTP.
        pk (str): ID de la commande.

    Returns:
        Réponse HTTP avec les données de la commande spécifiée.
    """
    user = request.user
    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    """
    Cette vue met à jour l'état d'une commande à "Payé".

    Args:
        request: L'objet de requête HTTP.
        pk (str): ID de la commande.

    Returns:
        Réponse HTTP confirmant que la commande a été payée.
    """
    order = Order.objects.get(_id=pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response('Order was paid')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    """
    Cette vue met à jour l'état d'une commande à "Livré".

    Args:
        request: L'objet de requête HTTP.
        pk (str): ID de la commande.

    Returns:
        Réponse HTTP confirmant que la commande a été livrée.
    """
    order = Order.objects.get(_id=pk)
    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()
    return Response('Order was delivered')
