from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    """
    Modèle de produit.

    Attributes:
        user (ForeignKey): Utilisateur associé au produit.
        name (CharField): Nom du produit.
        image (ImageField): Image du produit.
        discipline (CharField): Discipline à laquelle le produit appartient.
        category (CharField): Catégorie du produit.
        description (TextField): Description du produit.
        rating (DecimalField): Note du produit.
        numReviews (IntegerField): Nombre de critiques du produit.
        price (DecimalField): Prix du produit.
        countInStock (IntegerField): Nombre de produits en stock.
        createdAt (DateTimeField): Date de création du produit.
        _id (AutoField): Identifiant unique du produit (non éditable).
    """
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True,
                              default='/placeholder.png')
    discipline = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.name


class Review(models.Model):
    """
    Modèle de critique de produit.

    Attributes:
        product (ForeignKey): Produit associé à la critique.
        user (ForeignKey): Utilisateur qui a publié la critique.
        name (CharField): Nom de la critique.
        rating (IntegerField): Note attribuée à la critique.
        comment (TextField): Commentaire de la critique.
        createdAt (DateTimeField): Date de création de la critique.
        _id (AutoField): Identifiant unique de la critique (non éditable).
    """
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.rating)


class Order(models.Model):
    """
    Modèle de commande.

    Attributes:
        user (ForeignKey): Utilisateur ayant passé la commande.
        paymentMethod (CharField): Méthode de paiement utilisée.
        taxPrice (DecimalField): Montant de la taxe.
        shippingPrice (DecimalField): Frais de livraison.
        totalPrice (DecimalField): Prix total de la commande.
        isPaid (BooleanField): Statut de paiement de la commande.
        paidAt (DateTimeField): Date de paiement de la commande.
        isDelivered (BooleanField): Statut de livraison de la commande.
        deliveredAt (DateTimeField): Date de livraison de la commande.
        createdAt (DateTimeField): Date de création de la commande.
        _id (AutoField): Identifiant unique de la commande (non éditable).
    """
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(
        auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.createdAt)


class OrderItem(models.Model):
    """
    Modèle d'article de commande.

    Attributes:
        product (ForeignKey): Produit associé à l'article de commande.
        order (ForeignKey): Commande à laquelle l'article est associé.
        name (CharField): Nom de l'article.
        qty (IntegerField): Quantité commandée.
        price (DecimalField): Prix unitaire de l'article.
        image (CharField): Image de l'article.
        _id (AutoField): Identifiant unique de l'article (non éditable).
    """
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.name)


class ShippingAddress(models.Model):
    """
    Modèle d'adresse de livraison.

    Attributes:
        order (OneToOneField): Commande associée à l'adresse de livraison.
        address (CharField): Adresse de livraison.
        city (CharField): Ville de livraison.
        postalCode (CharField): Code postal de livraison.
        country (CharField): Pays de livraison.
        shippingPrice (DecimalField): Frais de livraison.
        _id (AutoField): Identifiant unique de l'adresse de livraison (non éditable).
    """
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.address)
