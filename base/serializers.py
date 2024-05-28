from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, Order, OrderItem, ShippingAddress, Review

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'objet User.
    """

    # Champ personnalisé pour le nom de l'utilisateur
    name = serializers.SerializerMethodField(read_only=True)
    
    # Champ personnalisé pour l'identifiant de l'utilisateur
    _id = serializers.SerializerMethodField(read_only=True)
    
    # Champ personnalisé pour déterminer si l'utilisateur est un administrateur
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get__id(self, obj):
        """
        Renvoie l'identifiant de l'utilisateur.
        
        Args:
            obj (User): Instance de l'utilisateur.
        
        Returns:
            int: Identifiant de l'utilisateur.
        """
        return obj.id

    def get_isAdmin(self, obj):
        """
        Détermine si l'utilisateur est un administrateur.
        
        Args:
            obj (User): Instance de l'utilisateur.
        
        Returns:
            bool: True si l'utilisateur est un administrateur, False sinon.
        """
        return obj.is_staff

    def get_name(self, obj):
        """
        Renvoie le nom de l'utilisateur.
        Si le nom est vide, renvoie l'adresse e-mail.
        
        Args:
            obj (User): Instance de l'utilisateur.
        
        Returns:
            str: Nom de l'utilisateur.
        """
        name = obj.first_name
        if name == '':
            name = obj.email
        return name


class UserSerializerWithToken(UserSerializer):
    """
    Serializer pour l'objet User avec jeton d'authentification.
    """

    # Champ pour le jeton d'authentification
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        """
        Renvoie le jeton d'authentification pour l'utilisateur.
        
        Args:
            obj (User): Instance de l'utilisateur.
        
        Returns:
            str: Jeton d'authentification.
        """
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'objet Review.
    """

    class Meta:
        model = Review
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'objet Product.
    """

    # Champ pour les avis associés au produit
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_reviews(self, obj):
        """
        Renvoie les avis associés au produit.
        
        Args:
            obj (Product): Instance du produit.
        
        Returns:
            list: Liste des avis associés au produit.
        """
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


class ShippingAddressSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'objet ShippingAddress.
    """

    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'objet OrderItem.
    """

    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'objet Order.
    """

    # Champ pour les éléments de commande associés à la commande
    orderItems = serializers.SerializerMethodField(read_only=True)
    
    # Champ pour l'adresse de livraison associée à la commande
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    
    # Champ pour l'utilisateur associé à la commande
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        """
        Renvoie les éléments de commande associés à la commande.
        
        Args:
            obj (Order): Instance de la commande.
        
        Returns:
            list: Liste des éléments de commande associés à la commande.
        """
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        """
        Renvoie l'adresse de livraison associée à la commande.
        
        Args:
            obj (Order): Instance de la commande.
        
        Returns:
            dict or bool: Adresse de livraison associée à la commande, ou False si elle n'existe pas.
        """
        try:
            address = ShippingAddressSerializer(obj.shippingaddress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        """
        Renvoie les détails de l'utilisateur associé à la commande.
        
        Args:
            obj (Order): Instance de la commande.
        
        Returns:
            dict: Détails de l'utilisateur associé à la commande.
        """
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data
