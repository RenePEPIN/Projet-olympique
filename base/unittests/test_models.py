# base/unittests/test_models.py
from django.test import TestCase
from django.contrib.auth.models import User
from base.models import Product, Review, Order, OrderItem, ShippingAddress

class ProductModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.product = Product.objects.create(
            user=self.user,
            name='Test Product',
            price=10.99,
            countInStock=100,
            description='A test product description'
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, 'Test Product')
        self.assertEqual(self.product.price, 10.99)
        self.assertEqual(self.product.countInStock, 100)
        self.assertEqual(str(self.product), 'Test Product')


class ReviewModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.product = Product.objects.create(
            user=self.user,
            name='Test Product'
        )
        self.review = Review.objects.create(
            product=self.product,
            user=self.user,
            rating=5,
            comment='Great product!'
        )

    def test_review_creation(self):
        self.assertEqual(self.review.rating, 5)
        self.assertEqual(self.review.comment, 'Great product!')
        self.assertEqual(str(self.review), '5')


class OrderModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.order = Order.objects.create(
            user=self.user,
            paymentMethod='Credit Card',
            taxPrice=1.99,
            shippingPrice=2.99,
            totalPrice=15.97,
            isPaid=True
        )

    def test_order_creation(self):
        self.assertEqual(self.order.paymentMethod, 'Credit Card')
        self.assertEqual(self.order.taxPrice, 1.99)
        self.assertEqual(self.order.shippingPrice, 2.99)
        self.assertEqual(self.order.totalPrice, 15.97)
        self.assertTrue(self.order.isPaid)
        self.assertIsNotNone(self.order.createdAt)
        self.assertEqual(str(self.order), str(self.order.createdAt))


class OrderItemModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.product = Product.objects.create(
            user=self.user,
            name='Test Product'
        )
        self.order = Order.objects.create(user=self.user)
        self.order_item = OrderItem.objects.create(
            product=self.product,
            order=self.order,
            name='Test Product',
            qty=2,
            price=10.99
        )

    def test_order_item_creation(self):
        self.assertEqual(self.order_item.name, 'Test Product')
        self.assertEqual(self.order_item.qty, 2)
        self.assertEqual(self.order_item.price, 10.99)
        self.assertEqual(str(self.order_item), 'Test Product')


class ShippingAddressModelTest(TestCase):
    def setUp(self):
        self.order = Order.objects.create(user=None)
        self.shipping_address = ShippingAddress.objects.create(
            order=self.order,
            address='123 Test St',
            city='Test City',
            postalCode='12345',
            country='Test Country',
            shippingPrice=5.99
        )

    def test_shipping_address_creation(self):
        self.assertEqual(self.shipping_address.address, '123 Test St')
        self.assertEqual(self.shipping_address.city, 'Test City')
        self.assertEqual(self.shipping_address.postalCode, '12345')
        self.assertEqual(self.shipping_address.country, 'Test Country')
        self.assertEqual(self.shipping_address.shippingPrice, 5.99)
        self.assertEqual(str(self.shipping_address), '123 Test St')
