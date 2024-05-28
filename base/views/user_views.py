from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from django.contrib.auth.models import User
from base.serializers import UserSerializer, UserSerializerWithToken

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.hashers import make_password
from rest_framework import status


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Surcharge de TokenObtainPairSerializer pour inclure des informations utilisateur supplémentaires dans la réponse.
    """

    def validate(self, attrs):
        """
        Valide les attributs et ajoute des informations utilisateur supplémentaires à la réponse.
        
        Args:
            attrs (dict): Les attributs à valider.

        Returns:
            dict: Les données validées avec des informations utilisateur supplémentaires.
        """
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Vue personnalisée pour l'obtention de paires de jetons.
    """
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    """
    Vue pour l'inscription d'un nouvel utilisateur.

    Args:
        request (HttpRequest): La requête HTTP contenant les données utilisateur.

    Returns:
        Response: La réponse HTTP avec les données de l'utilisateur enregistré ou un message d'erreur.
    """
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'Un utilisateur avec cet e-mail existe déjà'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    """
    Vue pour la mise à jour du profil utilisateur.

    Args:
        request (HttpRequest): La requête HTTP contenant les données de mise à jour du profil.

    Returns:
        Response: La réponse HTTP avec les données mises à jour du profil utilisateur.
    """
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    """
    Vue pour récupérer le profil de l'utilisateur actuellement connecté.

    Args:
        request (HttpRequest): La requête HTTP.

    Returns:
        Response: La réponse HTTP avec les données du profil de l'utilisateur.
    """
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    """
    Vue pour récupérer la liste de tous les utilisateurs (réservée aux administrateurs).

    Args:
        request (HttpRequest): La requête HTTP.

    Returns:
        Response: La réponse HTTP avec les données de tous les utilisateurs.
    """
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    """
    Vue pour récupérer les détails d'un utilisateur spécifique par ID (réservée aux administrateurs).

    Args:
        request (HttpRequest): La requête HTTP.
        pk (int): L'identifiant de l'utilisateur.

    Returns:
        Response: La réponse HTTP avec les données de l'utilisateur spécifié.
    """
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    """
    Vue pour mettre à jour les informations d'un utilisateur spécifique (réservée aux administrateurs).

    Args:
        request (HttpRequest): La requête HTTP contenant les données de mise à jour.
        pk (int): L'identifiant de l'utilisateur à mettre à jour.

    Returns:
        Response: La réponse HTTP avec les données mises à jour de l'utilisateur.
    """
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    """
    Vue pour supprimer un utilisateur spécifique (réservée aux administrateurs).

    Args:
        request (HttpRequest): La requête HTTP.
        pk (int): L'identifiant de l'utilisateur à supprimer.

    Returns:
        Response: La réponse HTTP confirmant la suppression de l'utilisateur.
    """
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('L\'utilisateur a été supprimé')
