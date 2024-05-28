from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.test import TestCase
from django.utils import timezone
from base.signals import updateUser

class UpdateUserTestCase(TestCase):
    
    def setUp(self):
        # Créer un utilisateur de test avec un email
        self.user_with_email = User.objects.create(username='testuser', email='test@example.com')
        
        # Créer un utilisateur de test sans email
        self.user_without_email = User.objects.create(username='testuser2')

    def test_update_username_with_email(self):
        # Simuler le signal pre_save en modifiant l'email de l'utilisateur avec un email valide
        self.user_with_email.email = 'updated_email@example.com'
        pre_save.send(sender=User, instance=self.user_with_email)

        # Vérifier que le nom d'utilisateur a été mis à jour avec le nouvel email
        self.assertEqual(self.user_with_email.username, 'updated_email@example.com')

    def test_update_username_with_empty_email(self):
        # Simuler le signal pre_save en modifiant l'email de l'utilisateur avec une chaîne vide
        self.user_with_email.email = ''
        pre_save.send(sender=User, instance=self.user_with_email)

        # Vérifier que le nom d'utilisateur reste le même
        self.assertEqual(self.user_with_email.username, 'test@example.com')

    def test_no_update_when_email_not_changed(self):
        # Simuler le signal pre_save sans modifier l'email de l'utilisateur
        pre_save.send(sender=User, instance=self.user_with_email)

        # Vérifier que le nom d'utilisateur reste le même
        self.assertEqual(self.user_with_email.username, 'test@example.com')

    def test_no_update_without_email(self):
        # Simuler le signal pre_save pour un utilisateur sans email
        pre_save.send(sender=User, instance=self.user_without_email)

        # Vérifier que le nom d'utilisateur reste le même
        self.assertEqual(self.user_without_email.username, 'testuser2')
