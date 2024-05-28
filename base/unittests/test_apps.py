# base/unittests/test_apps.py

# Importation de la classe de test de Django
from django.test import TestCase
# Importation de la configuration de l'application 'base'
from base.apps import BaseConfig

# Définition de la classe de test qui hérite de TestCase
class TestBaseConfigReady(TestCase):
    # Définition de la méthode de test
    def test_ready(self):
        # Nom de l'application, doit correspondre au nom défini dans 'INSTALLED_APPS'
        app_name = 'base'
        # Importation du module de l'application
        app_module = __import__('base')
        # Instanciation de la configuration de l'application avec les arguments requis
        config = BaseConfig(app_name, app_module)
        # Assertion pour vérifier que la configuration n'est pas None
        self.assertIsNotNone(config)
